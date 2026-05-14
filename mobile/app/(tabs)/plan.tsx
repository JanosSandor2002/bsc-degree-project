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

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalContext';
import { Colors } from '../../constants/Colors';
import { Button, EmptyState } from '../../components/ui';
import { API_URL } from '../../constants/api';

type ProjectStats = {
  total: number;
  done: number;
  inProgress: number;
  open: number;
};

const getProgressColor = (p: number) =>
  p === 100
    ? '#22c55e'
    : p >= 60
      ? Colors.accent
      : p >= 30
        ? '#f59e0b'
        : Colors.error;

const getLabel = (p: number) => {
  if (p === 100) return { text: 'Completed', bg: '#dcfce7', color: '#15803d' };
  if (p >= 60) return { text: 'On track', bg: '#dbeafe', color: '#1d4ed8' };
  if (p >= 30) return { text: 'In progress', bg: '#fef3c7', color: '#b45309' };
  if (p > 0) return { text: 'Just started', bg: '#ffedd5', color: '#c2410c' };
  return { text: 'Not started', bg: '#f1f5f9', color: '#64748b' };
};

export default function PlanScreen() {
  const { state } = useGlobalContext();
  const router = useRouter();
  const [statsMap, setStatsMap] = useState<Record<string, ProjectStats>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.token || state.projects.length === 0) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          state.projects.map((p: any) =>
            fetch(`${API_URL}/tasks/project/${p._id}`, {
              headers: { Authorization: `Bearer ${state.token}` },
            })
              .then((r) => r.json())
              .then((tasks) => ({ id: p._id, tasks }))
              .catch(() => ({ id: p._id, tasks: [] })),
          ),
        );
        const map: Record<string, ProjectStats> = {};
        results.forEach(({ id, tasks }) => {
          map[id] = {
            total: tasks.length,
            done: tasks.filter((t: any) => t.status === 'Done').length,
            inProgress: tasks.filter((t: any) => t.status === 'InProgress')
              .length,
            open: tasks.filter((t: any) => t.status === 'Open').length,
          };
        });
        setStatsMap(map);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [state.projects, state.token]);

  if (!state.user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centeredText}>Sign in to view Plan</Text>
          <Button
            title='Sign in'
            onPress={() => router.push('/sign')}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const completed = Object.values(statsMap).filter(
    (s) => s.total > 0 && s.done === s.total,
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Plan</Text>
          </View>
          <Text style={styles.heroTitle}>Project Overview</Text>
          <Text style={styles.heroSub}>
            Track progress across all your projects.
          </Text>
          <View style={styles.statsRow}>
            {[
              { v: String(state.projects.length), l: 'Projects' },
              { v: String(completed), l: 'Completed' },
              { v: String(state.projects.length - completed), l: 'Active' },
            ].map((s) => (
              <View key={s.l} style={styles.statPill}>
                <Text style={styles.statValue}>{s.v}</Text>
                <Text style={styles.statLabel}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {state.projects.length === 0 && !loading && (
          <EmptyState
            icon='▦'
            title='No projects yet'
            subtitle='Create a project to see it here'
          />
        )}
        {loading && (
          <Text style={styles.loadingText}>Loading project stats...</Text>
        )}

        {state.projects.map((project: any) => {
          const stats = statsMap[project._id];
          const percent = stats
            ? stats.total === 0
              ? 0
              : Math.round((stats.done / stats.total) * 100)
            : null;
          const label = percent !== null ? getLabel(percent) : null;
          const progressColor =
            percent !== null ? getProgressColor(percent) : Colors.accent;

          return (
            <View key={project._id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  {project.description && (
                    <Text style={styles.projectDesc} numberOfLines={1}>
                      {project.description}
                    </Text>
                  )}
                </View>
                {label && (
                  <View
                    style={[styles.labelBadge, { backgroundColor: label.bg }]}
                  >
                    <Text style={[styles.labelText, { color: label.color }]}>
                      {label.text}
                    </Text>
                  </View>
                )}
              </View>

              {/* Progress bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressPct}>{percent ?? 0}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${percent ?? 0}%` as any,
                        backgroundColor: progressColor,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Stats */}
              {stats && (
                <View style={styles.statsRow2}>
                  {[
                    { dot: '#22c55e', label: 'Done', val: stats.done },
                    {
                      dot: '#f59e0b',
                      label: 'In Progress',
                      val: stats.inProgress,
                    },
                    { dot: '#93c5fd', label: 'Open', val: stats.open },
                    { dot: '#cbd5e1', label: 'Total', val: stats.total },
                  ].map((s) => (
                    <View key={s.label} style={styles.statsItem}>
                      <View
                        style={[styles.statsDot, { backgroundColor: s.dot }]}
                      />
                      <Text style={styles.statsText}>
                        {s.label}: <Text style={styles.statsVal}>{s.val}</Text>
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {state.projects.length > 0 && (
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Keep shipping.</Text>
            <Text style={styles.footerSub}>
              Complete tasks to move your projects forward.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centeredText: { fontSize: 15, color: Colors.textMuted, textAlign: 'center' },
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
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.4)',
  },
  heroBadgeText: { color: '#bfdbfe', fontSize: 11, fontWeight: '500' },
  heroTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSub: { color: '#93c5fd', fontSize: 13, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 10 },
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
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  projectName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  projectDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  labelBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  labelText: { fontSize: 11, fontWeight: '600' },
  progressContainer: { marginBottom: 12 },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: { fontSize: 12, color: Colors.textMuted },
  progressPct: { fontSize: 12, fontWeight: '700', color: Colors.text },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.bg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: 4 },
  statsRow2: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statsItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statsDot: { width: 7, height: 7, borderRadius: 4 },
  statsText: { fontSize: 11, color: Colors.textMuted },
  statsVal: { fontWeight: '700', color: Colors.text },
  footer: { backgroundColor: Colors.primary, borderRadius: 18, padding: 18 },
  footerTitle: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  footerSub: { color: '#60a5fa', fontSize: 12, marginTop: 3 },
});
