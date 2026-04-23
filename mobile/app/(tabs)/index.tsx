import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalContext';
import { fetchProjects } from '../../context/Actions';
import { Colors } from '../../constants/Colors';
import { HeroBanner, Card } from '../../components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

const features = [
  {
    icon: '⠿',
    title: 'Kanban Board',
    desc: 'Visualize workflow across To Do, In Progress, and Done.',
  },
  {
    icon: '⟳',
    title: 'Scrum Sprints',
    desc: 'Plan work in focused time-boxes and track velocity.',
  },
  {
    icon: '▦',
    title: 'Plan Overview',
    desc: 'Track progress across all projects at a glance.',
  },
  {
    icon: '✦',
    title: 'Gamification',
    desc: 'Earn XP and level up by completing tasks.',
  },
  {
    icon: '❐',
    title: 'Tasks & Subtasks',
    desc: 'Break down complex work into manageable pieces.',
  },
  {
    icon: '✉',
    title: 'Mails',
    desc: 'Send messages to any registered user by username.',
  },
];

export default function HomeScreen() {
  const { state, dispatch } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (state.token) fetchProjects(dispatch, state.token);
  }, [state.token]);

  const xpRequired = (level: number, prestige: number) =>
    20 + (level + 1) * 10 + prestige * level * 10;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>
              Project Management · Reimagined
            </Text>
          </View>
          <Text style={styles.heroTitle}>
            Welcome to{'\n'}
            <Text style={styles.heroAccent}>Acxor</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Manage tasks, run sprints, track progress — and earn rewards along
            the way.
          </Text>

          {!state.user ? (
            <TouchableOpacity
              style={styles.heroCta}
              onPress={() => router.push('/sign')}
            >
              <Text style={styles.heroCtaText}>Get started — it's free →</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {state.user.username?.[0]?.toUpperCase() ?? '?'}
                </Text>
              </View>
              <View>
                <Text style={styles.userName}>
                  Welcome back, {state.user.username}!
                </Text>
                <Text style={styles.userXp}>
                  Level {state.user.level ?? 1} · {state.user.xp ?? 0} XP
                </Text>
              </View>
            </View>
          )}

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              { v: String(state.projects.length), l: 'Projects' },
              {
                v: state.user ? String(state.user.level ?? 1) : '-',
                l: 'Level',
              },
              { v: state.user ? String(state.user.xp ?? 0) : '-', l: 'XP' },
            ].map((s) => (
              <View key={s.l} style={styles.statPill}>
                <Text style={styles.statValue}>{s.v}</Text>
                <Text style={styles.statLabel}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Not logged in CTA */}
        {!state.user && (
          <Card style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to get organised?</Text>
            <Text style={styles.ctaBody}>
              Create a free account to start managing your projects today.
            </Text>
            <TouchableOpacity
              style={styles.ctaBtn}
              onPress={() => router.push('/sign')}
            >
              <Text style={styles.ctaBtnText}>Create account →</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Features grid */}
        <Text style={styles.sectionLabel}>WHAT'S INSIDE</Text>
        <Text style={styles.sectionTitle}>Everything your team needs</Text>
        <View style={styles.grid}>
          {features.map((f) => (
            <Card key={f.title} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </Card>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Acxor — BSc Degree Project</Text>
          <Text style={styles.footerSub}>
            React Native · Node.js · MongoDB · TypeScript
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroBadge: {
    backgroundColor: 'rgba(59,130,246,0.35)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.4)',
  },
  heroBadgeText: { color: '#bfdbfe', fontSize: 11, fontWeight: '500' },
  heroTitle: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 8,
  },
  heroAccent: { color: '#93c5fd' },
  heroSubtitle: {
    color: '#93c5fd',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  heroCta: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  heroCtaText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: Colors.primary, fontWeight: '700', fontSize: 16 },
  userName: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  userXp: { color: '#93c5fd', fontSize: 12, marginTop: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  statPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  statValue: { color: Colors.white, fontWeight: '700', fontSize: 18 },
  statLabel: { color: '#93c5fd', fontSize: 11, marginTop: 1 },
  ctaCard: { marginBottom: 16 },
  ctaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  ctaBody: { fontSize: 13, color: Colors.textMuted, marginBottom: 12 },
  ctaBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ctaBtnText: { color: Colors.white, fontWeight: '600', fontSize: 13 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  featureCard: { width: '47%', marginBottom: 0 },
  featureIcon: { fontSize: 22, marginBottom: 8 },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDesc: { fontSize: 11, color: Colors.textMuted, lineHeight: 16 },
  footer: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
  },
  footerTitle: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  footerSub: { color: '#60a5fa', fontSize: 12, marginTop: 3 },
});
