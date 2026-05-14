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

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalContext';
import { fetchLogs } from '../../context/Actions';
import { Colors } from '../../constants/Colors';
import { Button, EmptyState } from '../../components/ui';
import { ProjectPicker } from '../../components/ProjectPicker';

type LogEntry = {
  _id: string;
  message: string;
  createdAt: string;
  user?: { username: string } | null;
};

const getIcon = (msg: string): { icon: string; bg: string; color: string } => {
  if (msg.startsWith('Task completed'))
    return { icon: '✓', bg: '#dcfce7', color: '#15803d' };
  if (msg.startsWith('Task created'))
    return { icon: '+', bg: '#dbeafe', color: '#1d4ed8' };
  if (msg.startsWith('Task deleted'))
    return { icon: '✕', bg: '#fee2e2', color: '#b91c1c' };
  if (msg.startsWith('Task updated'))
    return { icon: '✎', bg: '#fef3c7', color: '#b45309' };
  if (msg.startsWith('Task assigned'))
    return { icon: '→', bg: '#f3e8ff', color: '#7c3aed' };
  if (msg.startsWith('Subtask completed'))
    return { icon: '✓', bg: '#f0fdf4', color: '#16a34a' };
  if (msg.startsWith('Subtask created'))
    return { icon: '+', bg: '#eff6ff', color: '#2563eb' };
  if (msg.startsWith('Subtask deleted'))
    return { icon: '✕', bg: '#fff1f2', color: '#be123c' };
  if (msg.startsWith('Sprint created'))
    return { icon: '⟳', bg: '#eef2ff', color: '#4338ca' };
  if (msg.startsWith('Sprint deleted'))
    return { icon: '✕', bg: '#fee2e2', color: '#b91c1c' };
  return { icon: '•', bg: Colors.inputBg, color: Colors.textMuted };
};

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return `${Math.floor(diffH / 24)}d ago`;
};

const groupByDate = (logs: LogEntry[]) => {
  const groups: { label: string; entries: LogEntry[] }[] = [];
  const seen = new Map<string, LogEntry[]>();
  logs.forEach((log) => {
    const d = new Date(log.createdAt);
    const now = new Date();
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    const label =
      d.toDateString() === now.toDateString()
        ? 'Today'
        : d.toDateString() === yest.toDateString()
          ? 'Yesterday'
          : d.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            });
    if (!seen.has(label)) {
      seen.set(label, []);
      groups.push({ label, entries: seen.get(label)! });
    }
    seen.get(label)!.push(log);
  });
  return groups;
};

export default function LogScreen() {
  const { state } = useGlobalContext();
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = async (silent = false) => {
    if (!state.token || !state.selectedProject?._id) return;
    if (!silent) setLoading(true);
    try {
      const data = await fetchLogs(state.token, state.selectedProject._id);
      setLogs(data);
    } catch {
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    setLogs([]);
    load();
    intervalRef.current = setInterval(() => load(true), 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.selectedProject?._id, state.token]);

  if (!state.user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centeredText}>
            Sign in to view the activity log
          </Text>
          <Button
            title='Sign in'
            onPress={() => router.push('/sign')}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const groups = groupByDate(logs);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Activity Log</Text>
        </View>
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>
              {state.selectedProject
                ? state.selectedProject.name
                : 'Select a project'}
            </Text>
            {state.selectedProject && (
              <Text style={styles.heroSub}>
                {logs.length} event{logs.length !== 1 ? 's' : ''} ·
                auto-refreshes every 10s
              </Text>
            )}
          </View>
          {state.selectedProject && (
            <TouchableOpacity style={styles.refreshBtn} onPress={() => load()}>
              <Text style={styles.refreshText}>↻</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.pickerRow}>
        <ProjectPicker />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {!state.selectedProject && (
          <EmptyState
            icon='◎'
            title='Select a project'
            subtitle='Choose a project to see its activity log'
          />
        )}
        {state.selectedProject && loading && logs.length === 0 && (
          <Text style={styles.loadingText}>Loading activity...</Text>
        )}
        {state.selectedProject && !loading && logs.length === 0 && (
          <EmptyState
            icon='◎'
            title='No activity yet'
            subtitle='Creating tasks, completing them, or managing sprints will appear here'
          />
        )}

        {groups.map((group) => (
          <View key={group.label}>
            {/* Date separator */}
            <View style={styles.dateSep}>
              <View style={styles.dateLine} />
              <Text style={styles.dateLabel}>{group.label}</Text>
              <View style={styles.dateLine} />
            </View>

            {[...group.entries].reverse().map((log) => {
              const { icon, bg, color } = getIcon(log.message);
              return (
                <View key={log._id} style={styles.logRow}>
                  <View style={[styles.logIcon, { backgroundColor: bg }]}>
                    <Text style={[styles.logIconText, { color }]}>{icon}</Text>
                  </View>
                  <View style={styles.logContent}>
                    <Text style={styles.logMessage}>{log.message}</Text>
                    <View style={styles.logMeta}>
                      {log.user && (
                        <Text style={styles.logUser}>{log.user.username}</Text>
                      )}
                      <Text style={styles.logTime}>
                        {fmtTime(log.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
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
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  heroBadge: {
    backgroundColor: 'rgba(59,130,246,0.35)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.4)',
  },
  heroBadgeText: { color: '#bfdbfe', fontSize: 11, fontWeight: '500' },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroTitle: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  heroSub: { color: '#93c5fd', fontSize: 12, marginTop: 2 },
  refreshBtn: {
    backgroundColor: Colors.white,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: { color: Colors.primary, fontSize: 18, fontWeight: '700' },
  pickerRow: { paddingHorizontal: 16, marginTop: 12, marginBottom: 4 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  dateSep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 12,
  },
  dateLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dateLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  logIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  logIconText: { fontSize: 13, fontWeight: '700' },
  logContent: { flex: 1 },
  logMessage: { fontSize: 13, color: Colors.text, lineHeight: 18 },
  logMeta: { flexDirection: 'row', gap: 8, marginTop: 3 },
  logUser: { fontSize: 11, color: Colors.accent, fontWeight: '500' },
  logTime: { fontSize: 11, color: Colors.textLight },
});
