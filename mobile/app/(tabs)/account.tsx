/*
 * Acxor Projektmenedzsment Rendszer
 * Szerző: Sándor János, 2026
 * Miskolci Egyetem — Szakdolgozat
 *
 * Megjegyzés: egyes kódrészletek generálása, hibakeresése
 * és javítása Claude (Anthropic) MI-alapú eszköz
 * segítségével történt, minden esetben kritikus szakmai
 * felülvizsgálattal párosulva.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalContext';
import { updateUser } from '../../context/Actions';
import { Colors } from '../../constants/Colors';
import { Button, Input, Toast, Card } from '../../components/ui';

const xpRequired = (level: number, prestige: number) =>
  20 + (level + 1) * 10 + prestige * level * 10;
const BADGE_LEVELS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

type EditField = 'username' | 'email' | 'password' | null;

export default function AccountScreen() {
  const { state, dispatch } = useGlobalContext();
  const router = useRouter();
  const user = state.user;

  const [editField, setEditField] = useState<EditField>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centeredText}>Sign in to view your account</Text>
          <Button
            title='Sign in'
            onPress={() => router.push('/sign')}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const xpNeeded = xpRequired(user.level ?? 1, user.prestige ?? 0);
  const xpPercent = Math.min(
    100,
    Math.round(((user.xp ?? 0) / xpNeeded) * 100),
  );
  const earnedBadges = BADGE_LEVELS.filter((b) => b <= (user.level ?? 1));
  const nextBadge = BADGE_LEVELS.find((b) => b > (user.level ?? 1)) ?? null;
  const progressColor =
    xpPercent === 100 ? '#22c55e' : xpPercent >= 60 ? Colors.accent : '#f59e0b';

  const handleSave = async () => {
    if (!state.token || !editField) return;
    setSaving(true);
    const payload: Record<string, string> = {};
    if (editField === 'username') {
      if (!formData.username.trim()) {
        setSaving(false);
        return;
      }
      payload.username = formData.username.trim();
    }
    if (editField === 'email') {
      if (!formData.email.trim()) {
        setSaving(false);
        return;
      }
      payload.email = formData.email.trim();
    }
    if (editField === 'password') {
      if (formData.password.length < 6) {
        showToast('Password must be at least 6 characters', false);
        setSaving(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast('Passwords do not match', false);
        setSaving(false);
        return;
      }
      payload.password = formData.password;
    }
    const result = (await updateUser(dispatch, state.token, payload)) as any;
    setSaving(false);
    if (result?.success !== false) {
      showToast(
        editField === 'password' ? 'Password updated' : `${editField} updated`,
        true,
      );
      setEditField(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } else {
      showToast(result.message || 'Update failed', false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'LOGOUT' });
          router.replace('/sign');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {toast && (
        <Toast message={toast.msg} type={toast.ok ? 'success' : 'error'} />
      )}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Account</Text>
          </View>
          <View style={styles.heroRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.username?.[0]?.toUpperCase() ?? '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroName}>{user.username}</Text>
              <Text style={styles.heroEmail}>{user.email}</Text>
            </View>
          </View>
        </View>

        {/* XP & Level */}
        <Card>
          <Text style={styles.sectionLabel}>PROGRESS</Text>
          <View style={styles.levelRow}>
            <View style={styles.levelBig}>
              <Text style={styles.levelNum}>{user.level ?? 1}</Text>
              <Text style={styles.levelLabel}>Level</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.xpLabelRow}>
                <Text style={styles.xpLabel}>{user.xp ?? 0} XP</Text>
                <Text style={styles.xpLabel}>{xpNeeded} needed</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${xpPercent}%` as any,
                      backgroundColor: progressColor,
                    },
                  ]}
                />
              </View>
              <Text style={styles.nextBadge}>
                {nextBadge
                  ? `Next badge at level ${nextBadge}`
                  : 'Max badge tier reached'}
              </Text>
            </View>
            {(user.prestige ?? 0) > 0 && (
              <View style={styles.prestigeBox}>
                <Text style={styles.prestigeNum}>{user.prestige}</Text>
                <Text style={styles.prestigeLabel}>Prestige</Text>
              </View>
            )}
          </View>
          {earnedBadges.length > 0 && (
            <View
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTopWidth: 1,
                borderTopColor: Colors.border,
              }}
            >
              <Text style={styles.badgesTitle}>Earned badges</Text>
              <View style={styles.badgesRow}>
                {earnedBadges.map((b) => (
                  <View key={b} style={styles.badge}>
                    <Text style={styles.badgeText}>Lv {b}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Card>

        {/* Profile */}
        <Card>
          <Text style={styles.sectionLabel}>PROFILE</Text>
          {[
            {
              label: 'Username',
              value: user.username,
              field: 'username' as EditField,
            },
            { label: 'Email', value: user.email, field: 'email' as EditField },
            {
              label: 'Password',
              value: '••••••••',
              field: 'password' as EditField,
            },
          ].map((row, idx) => (
            <View key={row.field}>
              {idx > 0 && <View style={styles.rowDivider} />}
              <View style={styles.profileRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileFieldLabel}>{row.label}</Text>
                  <Text style={styles.profileFieldValue}>{row.value}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => setEditField(row.field)}
                >
                  <Text style={styles.editBtnText}>
                    {row.field === 'password' ? 'Change' : 'Edit'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Card>

        {/* Stats */}
        <Card>
          <Text style={styles.sectionLabel}>STATS</Text>
          <View style={styles.statsGrid}>
            {[
              { label: 'Projects', value: state.projects.length },
              { label: 'XP total', value: user.xp ?? 0 },
              { label: 'Level', value: user.level ?? 1 },
              { label: 'Prestige', value: user.prestige ?? 0 },
            ].map((s) => (
              <View key={s.label} style={styles.statCell}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Create Project */}
        <Button
          title='⊞ Create New Project'
          variant='secondary'
          onPress={() => router.push('/create-project')}
          style={{ marginBottom: 10 }}
        />

        {/* Logout */}
        <Button title='Log Out' variant='danger' onPress={handleLogout} />

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Acxor — BSc Degree Project</Text>
          <Text style={styles.footerSub}>
            React Native · Node.js · MongoDB · TypeScript
          </Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={!!editField} animationType='slide' transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>
                {editField === 'password'
                  ? 'Change Password'
                  : `Edit ${editField}`}
              </Text>

              {editField === 'username' && (
                <Input
                  label='New username'
                  placeholder={user.username}
                  value={formData.username}
                  onChangeText={(v) =>
                    setFormData({ ...formData, username: v })
                  }
                  autoFocus
                />
              )}
              {editField === 'email' && (
                <Input
                  label='New email'
                  placeholder={user.email}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  value={formData.email}
                  onChangeText={(v) => setFormData({ ...formData, email: v })}
                  autoFocus
                />
              )}
              {editField === 'password' && (
                <>
                  <Input
                    label='New password (min. 6 chars)'
                    placeholder='••••••••'
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(v) =>
                      setFormData({ ...formData, password: v })
                    }
                    autoFocus
                  />
                  <Input
                    label='Confirm new password'
                    placeholder='••••••••'
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(v) =>
                      setFormData({ ...formData, confirmPassword: v })
                    }
                  />
                </>
              )}

              <View style={styles.modalBtns}>
                <Button
                  title='Cancel'
                  variant='secondary'
                  onPress={() => {
                    setEditField(null);
                    setFormData({
                      username: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                    });
                  }}
                  style={{ flex: 1 }}
                />
                <Button
                  title={saving ? 'Saving...' : 'Save'}
                  onPress={handleSave}
                  loading={saving}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centeredText: { fontSize: 15, color: Colors.textMuted, textAlign: 'center' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
  },
  heroBadge: {
    backgroundColor: 'rgba(59,130,246,0.35)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.4)',
  },
  heroBadgeText: { color: '#bfdbfe', fontSize: 11, fontWeight: '500' },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(59,130,246,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.4)',
  },
  avatarText: { color: Colors.white, fontWeight: '800', fontSize: 22 },
  heroName: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  heroEmail: { color: '#93c5fd', fontSize: 13, marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  levelBig: { alignItems: 'center', width: 52 },
  levelNum: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primaryLight,
    lineHeight: 34,
  },
  levelLabel: { fontSize: 11, color: Colors.textMuted },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  xpLabel: { fontSize: 11, color: Colors.textMuted },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.bg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: 4 },
  nextBadge: { fontSize: 11, color: Colors.textLight, marginTop: 4 },
  prestigeBox: { alignItems: 'center', width: 48 },
  prestigeNum: { fontSize: 22, fontWeight: '800', color: '#7c3aed' },
  prestigeLabel: { fontSize: 10, color: Colors.textMuted },
  badgesTitle: { fontSize: 11, color: Colors.textMuted, marginBottom: 8 },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: {
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: { fontSize: 11, color: Colors.primaryLight, fontWeight: '600' },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowDivider: { height: 1, backgroundColor: Colors.bg, marginVertical: 2 },
  profileFieldLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  profileFieldValue: { fontSize: 14, fontWeight: '500', color: Colors.text },
  editBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  editBtnText: { color: Colors.primaryLight, fontSize: 12, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCell: {
    width: '47%',
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 12,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.primaryLight },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  footer: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 18,
    marginTop: 14,
  },
  footerTitle: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  footerSub: { color: '#60a5fa', fontSize: 12, marginTop: 3 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 8 },
});
