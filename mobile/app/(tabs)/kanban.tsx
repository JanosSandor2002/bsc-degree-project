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

import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalContext';
import { fetchTasks } from '../../context/Actions';
import { Colors } from '../../constants/Colors';
import { Button, EmptyState } from '../../components/ui';
import { ProjectPicker } from '../../components/ProjectPicker';

type Task = {
  _id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Done';
  deadline?: string;
  assignedTo?: { username: string } | null;
};

const COLUMNS = [
  {
    key: 'Open' as const,
    label: 'To Do',
    accent: Colors.accent,
    badgeBg: '#dbeafe',
    badgeText: '#1d4ed8',
    dotColor: Colors.accent,
  },
  {
    key: 'InProgress' as const,
    label: 'In Progress',
    accent: '#f59e0b',
    badgeBg: '#fef3c7',
    badgeText: '#b45309',
    dotColor: '#f59e0b',
  },
  {
    key: 'Done' as const,
    label: 'Done',
    accent: '#22c55e',
    badgeBg: '#dcfce7',
    badgeText: '#15803d',
    dotColor: '#22c55e',
  },
];

export default function KanbanScreen() {
  const { state, dispatch } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (state.token && state.selectedProject?._id) {
      fetchTasks(dispatch, state.token, state.selectedProject._id);
    }
  }, [state.selectedProject?._id]);

  if (!state.user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centeredText}>Sign in to view Kanban</Text>
          <Button
            title='Sign in'
            onPress={() => router.push('/sign')}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const done = state.tasks.filter((t: Task) => t.status === 'Done').length;
  const total = state.tasks.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Kanban Board</Text>
          </View>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>
                {state.selectedProject
                  ? state.selectedProject.name
                  : 'Select a project'}
              </Text>
              {state.selectedProject && total > 0 && (
                <Text style={styles.heroSub}>
                  {done} of {total} tasks completed
                </Text>
              )}
            </View>
            {state.selectedProject && total > 0 && (
              <View style={styles.progressBubble}>
                <Text style={styles.progressPct}>
                  {Math.round((done / total) * 100)}%
                </Text>
                <Text style={styles.progressLabel}>done</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.pickerRow}>
          <ProjectPicker />
        </View>

        {!state.selectedProject && (
          <EmptyState
            icon='⠿'
            title='Select a project'
            subtitle='Choose a project to load the board'
          />
        )}
        {state.loading && (
          <Text style={styles.loadingText}>Loading tasks...</Text>
        )}

        {/* Columns */}
        {COLUMNS.map((col) => {
          const tasks = state.tasks.filter((t: Task) => t.status === col.key);
          return (
            <View key={col.key} style={styles.column}>
              {/* Column header */}
              <View style={styles.colHeader}>
                <View style={styles.colHeaderLeft}>
                  <View
                    style={[styles.colDot, { backgroundColor: col.dotColor }]}
                  />
                  <Text style={styles.colLabel}>{col.label.toUpperCase()}</Text>
                </View>
                <View
                  style={[styles.colBadge, { backgroundColor: col.badgeBg }]}
                >
                  <Text style={[styles.colBadgeText, { color: col.badgeText }]}>
                    {tasks.length}
                  </Text>
                </View>
              </View>

              {/* Column body */}
              <View style={[styles.colBody, { borderTopColor: col.accent }]}>
                {tasks.length === 0 ? (
                  <Text style={styles.colEmpty}>No tasks</Text>
                ) : (
                  tasks.map((task: Task) => (
                    <View key={task._id} style={styles.taskCard}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <View style={styles.taskMeta}>
                        {task.assignedTo && (
                          <View style={styles.assigneeRow}>
                            <View style={styles.assigneeAvatar}>
                              <Text style={styles.assigneeAvatarText}>
                                {task.assignedTo.username[0].toUpperCase()}
                              </Text>
                            </View>
                            <Text style={styles.assigneeText}>
                              {task.assignedTo.username}
                            </Text>
                          </View>
                        )}
                        {task.deadline && (
                          <Text style={styles.deadlineText}>
                            {new Date(task.deadline).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' },
                            )}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          );
        })}
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
    padding: 20,
    marginBottom: 12,
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
  heroSub: { color: '#93c5fd', fontSize: 12, marginTop: 3 },
  progressBubble: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  progressPct: { color: Colors.white, fontWeight: '800', fontSize: 20 },
  progressLabel: { color: '#93c5fd', fontSize: 10, marginTop: 1 },
  pickerRow: { marginBottom: 16 },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  column: { marginBottom: 16 },
  colHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  colHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colDot: { width: 8, height: 8, borderRadius: 4 },
  colLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  colBadge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 },
  colBadgeText: { fontSize: 11, fontWeight: '700' },
  colBody: {
    backgroundColor: Colors.white,
    borderTopWidth: 3,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 60,
  },
  colEmpty: {
    color: Colors.textLight,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 12,
  },
  taskCard: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  taskTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  assigneeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  assigneeAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assigneeAvatarText: {
    color: Colors.primaryLight,
    fontSize: 9,
    fontWeight: '700',
  },
  assigneeText: { fontSize: 11, color: Colors.textMuted },
  deadlineText: { fontSize: 11, color: Colors.textLight },
});
