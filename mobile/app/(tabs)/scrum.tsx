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
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalContext';
import {
  fetchTasks,
  fetchSprints,
  createSprint,
  assignTaskToSprint,
  deleteSprint,
} from '../../context/Actions';
import { Colors } from '../../constants/Colors';
import { Button, Card, EmptyState, Input } from '../../components/ui';
import { ProjectPicker } from '../../components/ProjectPicker';

type Task = {
  _id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Done';
  sprint?: string | null;
  assignedTo?: { username: string } | null;
  deadline?: string;
};
type Sprint = { _id: string; name: string; startDate: string; endDate: string };

const COLS = [
  { key: 'Open' as const, label: 'To Do', dot: Colors.accent },
  { key: 'InProgress' as const, label: 'In Progress', dot: '#f59e0b' },
  { key: 'Done' as const, label: 'Done', dot: '#22c55e' },
];

const getSprintId = (sprint: any) => {
  if (!sprint) return null;
  if (typeof sprint === 'string') return sprint;
  return sprint._id ?? null;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
const isActive = (s: Sprint) => {
  const now = new Date();
  return new Date(s.startDate) <= now && now <= new Date(s.endDate);
};

export default function ScrumScreen() {
  const { state, dispatch } = useGlobalContext();
  const router = useRouter();
  const [selectedSprintId, setSelectedSprintId] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newSprint, setNewSprint] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (state.token && state.selectedProject?._id) {
      fetchTasks(dispatch, state.token, state.selectedProject._id);
      fetchSprints(dispatch, state.token, state.selectedProject._id);
    }
  }, [state.selectedProject?._id]);

  useEffect(() => {
    if (state.sprints?.length > 0 && !selectedSprintId) {
      setSelectedSprintId(state.sprints[0]._id);
    }
  }, [state.sprints]);

  if (!state.user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centeredText}>Sign in to view Scrum board</Text>
          <Button
            title='Sign in'
            onPress={() => router.push('/sign')}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleCreateSprint = async () => {
    if (
      !newSprint.name ||
      !newSprint.startDate ||
      !newSprint.endDate ||
      !state.token ||
      !state.selectedProject?._id
    )
      return;
    await createSprint(dispatch, state.token, {
      name: newSprint.name,
      projectId: state.selectedProject._id,
      startDate: newSprint.startDate,
      endDate: newSprint.endDate,
    });
    setNewSprint({ name: '', startDate: '', endDate: '' });
    setShowCreate(false);
  };

  const handleDeleteSprint = (sprintId: string) => {
    Alert.alert('Delete Sprint', 'Tasks will return to backlog.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!state.token) return;
          await deleteSprint(dispatch, state.token, sprintId);
          if (selectedSprintId === sprintId) setSelectedSprintId('');
        },
      },
    ]);
  };

  const handleAssign = async (taskId: string) => {
    if (!selectedSprintId || !state.token) return;
    await assignTaskToSprint(dispatch, state.token, selectedSprintId, taskId);
    fetchTasks(dispatch, state.token, state.selectedProject._id);
  };

  const selectedSprint: Sprint | undefined = state.sprints?.find(
    (s: Sprint) => s._id === selectedSprintId,
  );
  const sprintTasks = state.tasks.filter(
    (t: Task) => getSprintId(t.sprint) === selectedSprintId,
  );
  const backlogTasks = state.tasks.filter((t: Task) => !t.sprint);
  const doneCount = sprintTasks.filter((t: Task) => t.status === 'Done').length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Scrum Board</Text>
          </View>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>
                {state.selectedProject
                  ? state.selectedProject.name
                  : 'Select a project'}
              </Text>
              {selectedSprint && (
                <Text style={styles.heroSub}>
                  {selectedSprint.name} · {fmt(selectedSprint.startDate)} →{' '}
                  {fmt(selectedSprint.endDate)}
                </Text>
              )}
            </View>
            {state.selectedProject && (
              <TouchableOpacity
                style={styles.heroBtn}
                onPress={() => setShowCreate(!showCreate)}
              >
                <Text style={styles.heroBtnText}>
                  {showCreate ? 'Cancel' : '+ Sprint'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.pickerRow}>
          <ProjectPicker />
        </View>

        {/* Create form */}
        {showCreate && (
          <Card>
            <Text style={styles.cardTitle}>New Sprint</Text>
            <Input
              label='Sprint name'
              placeholder='Sprint 1'
              value={newSprint.name}
              onChangeText={(v) => setNewSprint({ ...newSprint, name: v })}
            />
            <Input
              label='Start date (YYYY-MM-DD)'
              placeholder='2025-01-01'
              value={newSprint.startDate}
              onChangeText={(v) => setNewSprint({ ...newSprint, startDate: v })}
            />
            <Input
              label='End date (YYYY-MM-DD)'
              placeholder='2025-01-14'
              value={newSprint.endDate}
              onChangeText={(v) => setNewSprint({ ...newSprint, endDate: v })}
            />
            <Button
              title='Create Sprint'
              onPress={handleCreateSprint}
              disabled={
                !newSprint.name || !newSprint.startDate || !newSprint.endDate
              }
            />
          </Card>
        )}

        {!state.selectedProject && (
          <EmptyState
            icon='⟳'
            title='Select a project'
            subtitle='Choose a project to load sprints'
          />
        )}

        {/* Sprint selector */}
        {state.sprints?.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.sprintTabs}
          >
            {state.sprints.map((sprint: Sprint) => (
              <View key={sprint._id} style={styles.sprintTabWrap}>
                <TouchableOpacity
                  style={[
                    styles.sprintTab,
                    selectedSprintId === sprint._id && styles.sprintTabActive,
                  ]}
                  onPress={() => setSelectedSprintId(sprint._id)}
                >
                  <Text
                    style={[
                      styles.sprintTabText,
                      selectedSprintId === sprint._id &&
                        styles.sprintTabTextActive,
                    ]}
                  >
                    {sprint.name}
                  </Text>
                  {isActive(sprint) && <View style={styles.activeDot} />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteSprintBtn}
                  onPress={() => handleDeleteSprint(sprint._id)}
                >
                  <Text style={styles.deleteSprintText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Sprint info bar */}
        {selectedSprint && (
          <View style={styles.infoBar}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tasks</Text>
              <Text style={styles.infoValue}>{sprintTasks.length}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Done</Text>
              <Text style={[styles.infoValue, { color: '#22c55e' }]}>
                {doneCount}
              </Text>
            </View>
            {sprintTasks.length > 0 && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Progress</Text>
                <Text style={[styles.infoValue, { color: Colors.accent }]}>
                  {Math.round((doneCount / sprintTasks.length) * 100)}%
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Kanban columns */}
        {selectedSprint &&
          COLS.map((col) => {
            const tasks = sprintTasks.filter((t: Task) => t.status === col.key);
            return (
              <View key={col.key} style={styles.column}>
                <View style={styles.colHeader}>
                  <View style={[styles.colDot, { backgroundColor: col.dot }]} />
                  <Text style={styles.colLabel}>{col.label.toUpperCase()}</Text>
                  <Text style={styles.colCount}>{tasks.length}</Text>
                </View>
                <View style={styles.colBody}>
                  {tasks.length === 0 ? (
                    <Text style={styles.colEmpty}>No tasks</Text>
                  ) : (
                    tasks.map((t: Task) => (
                      <View key={t._id} style={styles.taskCard}>
                        <Text style={styles.taskTitle}>{t.title}</Text>
                        {t.assignedTo && (
                          <Text style={styles.assignee}>
                            👤 {t.assignedTo.username}
                          </Text>
                        )}
                      </View>
                    ))
                  )}
                </View>
              </View>
            );
          })}

        {/* Backlog */}
        {backlogTasks.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <Text style={styles.backlogHeader}>
              BACKLOG ({backlogTasks.length})
            </Text>
            {backlogTasks.map((t: Task) => (
              <View key={t._id} style={styles.backlogCard}>
                <Text style={styles.backlogTitle} numberOfLines={1}>
                  {t.title}
                </Text>
                {selectedSprintId && (
                  <TouchableOpacity
                    style={styles.addToSprintBtn}
                    onPress={() => handleAssign(t._id)}
                  >
                    <Text style={styles.addToSprintText}>+ Add</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
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
  heroBtn: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  heroBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 12 },
  pickerRow: { marginBottom: 12 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  sprintTabs: { marginBottom: 12 },
  sprintTabWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    gap: 4,
  },
  sprintTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sprintTabActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },
  sprintTabText: { fontSize: 13, fontWeight: '600', color: Colors.textMuted },
  sprintTabTextActive: { color: Colors.white },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
  },
  deleteSprintBtn: {
    backgroundColor: '#fee2e2',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  deleteSprintText: { color: Colors.error, fontSize: 11, fontWeight: '700' },
  infoBar: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: Colors.inputBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoItem: { alignItems: 'center' },
  infoLabel: { fontSize: 11, color: Colors.textMuted },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 1,
  },
  column: { marginBottom: 14 },
  colHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  colDot: { width: 8, height: 8, borderRadius: 4 },
  colLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    flex: 1,
  },
  colCount: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  colBody: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  colEmpty: {
    color: Colors.textLight,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
  },
  taskCard: {
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  taskTitle: { fontSize: 13, fontWeight: '600', color: Colors.text },
  assignee: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  backlogHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  backlogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backlogTitle: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  addToSprintBtn: {
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  addToSprintText: { color: Colors.accent, fontSize: 11, fontWeight: '600' },
});
