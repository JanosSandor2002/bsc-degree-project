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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../context/GlobalContext';
import { loginUser, registerUser } from '../context/Actions';
import { Input, Button } from '../components/ui';
import { Colors } from '../constants/Colors';

export default function SignScreen() {
  const { state, dispatch } = useGlobalContext();
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    await loginUser(dispatch, loginData);
    if (!state.error) router.replace('/(tabs)');
  };

  const handleRegister = async () => {
    await registerUser(dispatch, registerData);
    if (!state.error) router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps='handled'
        >
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>Welcome to Acxor</Text>
            </View>
            <Text style={styles.heroTitle}>
              {tab === 'login'
                ? 'Sign in to your account'
                : 'Create a free account'}
            </Text>
            <Text style={styles.heroSub}>
              {tab === 'login'
                ? 'Good to have you back. Enter your credentials to continue.'
                : 'Join Acxor and start managing your projects today.'}
            </Text>
          </View>

          <View style={styles.card}>
            {/* Tab switcher */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tab, tab === 'login' && styles.tabActive]}
                onPress={() => setTab('login')}
              >
                <Text
                  style={[
                    styles.tabText,
                    tab === 'login' && styles.tabTextActive,
                  ]}
                >
                  Sign in
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, tab === 'register' && styles.tabActive]}
                onPress={() => setTab('register')}
              >
                <Text
                  style={[
                    styles.tabText,
                    tab === 'register' && styles.tabTextActive,
                  ]}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            {tab === 'login' ? (
              <View>
                <Input
                  label='Email address'
                  placeholder='you@example.com'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  value={loginData.email}
                  onChangeText={(v) => setLoginData({ ...loginData, email: v })}
                />
                <Input
                  label='Password'
                  placeholder='••••••••'
                  secureTextEntry
                  value={loginData.password}
                  onChangeText={(v) =>
                    setLoginData({ ...loginData, password: v })
                  }
                />
                <Button
                  title={state.loading ? 'Signing in...' : 'Sign in →'}
                  onPress={handleLogin}
                  loading={state.loading}
                />
              </View>
            ) : (
              <View>
                <Input
                  label='Username'
                  placeholder='cooldev42'
                  autoCapitalize='none'
                  value={registerData.username}
                  onChangeText={(v) =>
                    setRegisterData({ ...registerData, username: v })
                  }
                />
                <Input
                  label='Email address'
                  placeholder='you@example.com'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  value={registerData.email}
                  onChangeText={(v) =>
                    setRegisterData({ ...registerData, email: v })
                  }
                />
                <Input
                  label='Password'
                  placeholder='••••••••'
                  secureTextEntry
                  value={registerData.password}
                  onChangeText={(v) =>
                    setRegisterData({ ...registerData, password: v })
                  }
                />
                <Button
                  title={
                    state.loading ? 'Creating account...' : 'Create account →'
                  }
                  onPress={handleRegister}
                  loading={state.loading}
                />
              </View>
            )}

            {state.error && (
              <View style={styles.error}>
                <Text style={styles.errorText}>{state.error}</Text>
              </View>
            )}

            <Text style={styles.switchHint}>
              {tab === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <Text
                style={styles.switchLink}
                onPress={() => setTab(tab === 'login' ? 'register' : 'login')}
              >
                {tab === 'login' ? 'Register here' : 'Sign in'}
              </Text>
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Acxor — BSc Degree Project</Text>
            <Text style={styles.footerSub}>
              React Native · Node.js · MongoDB · TypeScript
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 16, paddingBottom: 32 },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
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
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSub: { color: '#93c5fd', fontSize: 13, lineHeight: 19 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bg,
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  tabActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.accent },
  tabTextActive: { color: Colors.primary },
  error: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  errorText: { color: Colors.error, fontSize: 13 },
  switchHint: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 16,
  },
  switchLink: { color: Colors.primaryLight, fontWeight: '600' },
  footer: { backgroundColor: Colors.primary, borderRadius: 18, padding: 18 },
  footerTitle: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  footerSub: { color: '#60a5fa', fontSize: 12, marginTop: 3 },
});
