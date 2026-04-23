import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalContext';
import {
  fetchTasks,
  fetchSubtasks,
  addSubtask,
  updateSubtask,
  completeSubtask,
  deleteSubtask,
} from '../../context/Actions';
import { Colors } from '../../constants/Colors';
import {
  Button,
  Badge,
  Card,
  EmptyState,
  Toast,
  Input,
} from '../../components/ui';
import { ProjectPicker } from '../../components/ProjectPicker';

type Task = {
  _id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Done';
};
type Subtask = {
  _id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Done';
  task: string;
};

const STATUS_OPTIONS: Subtask['status'][] = ['Open', 'InProgress', 'Done'];

export default function SubtasksScreen() {
  const { state, dispatch } = useGlobalContext();
  const router = useRouter();
  const [addingForTask, setAddingForTask] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [editingSub, setEditingSub] = useState<Subtask | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    status: 'Open' as Subtask['status'],
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (state.token && state.selectedProject?._id) {
      fetchTasks(dispatch, state.token, state.selectedProject._id);
    }
  }, [state.selectedProject?._id]);

  useEffect(() => {
    if (state.token && state.tasks.length > 0) {
      state.tasks.forEach((t: Task) =>
        fetchSubtasks(dispatch, state.token!, t._id),
      );
      // Expand all tasks by default
      setExpandedTasks(new Set(state.tasks.map((t: Task) => t._id)));
    }
  }, [state.tasks.length]);

  if (!state.user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centeredText}>Sign in to manage subtasks</Text>
          <Button
            title='Sign in'
            onPress={() => router.push('/sign')}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  };

  const handleAddSubtask = async (taskId: string) => {
    if (!newTitle.trim() || !state.token) return;
    await addSubtask(dispatch, state.token, {
      title: newTitle.trim(),
      task: taskId,
    });
    setNewTitle('');
    setAddingForTask(null);
  };

  const handleEditSave = async () => {
    if (!editingSub || !state.token) return;
    setLoadingId(editingSub._id);
    const becomingDone =
      editData.status === 'Done' && editingSub.status !== 'Done';
    if (becomingDone) {
      await completeSubtask(dispatch, state.token, editingSub._id, {
        title: editData.title.trim(),
      });
      showToast('✦ Subtask completed! +3 XP awarded');
    } else {
      await updateSubtask(dispatch, state.token, editingSub._id, {
        title: editData.title.trim(),
        status: editData.status,
      });
    }
    setLoadingId(null);
    setEditingSub(null);
  };

  const handleDelete = (subId: string) => {
    Alert.alert('Delete Subtask', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!state.token) return;
          setLoadingId(subId);
          await deleteSubtask(dispatch, state.token, subId);
          setLoadingId(null);
        },
      },
    ]);
  };

  const totalSubs = state.subtasks.length;
  const doneSubs = state.subtasks.filter(
    (s: Subtask) => s.status === 'Done',
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      {toast && <Toast message={toast} />}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Subtasks</Text>
          </View>
          <Text style={styles.heroTitle}>
            {state.selectedProject
              ? state.selectedProject.name
              : 'Select a project'}
          </Text>
          {totalSubs > 0 && (
            <Text style={styles.heroSub}>
              {doneSubs} of {totalSubs} subtasks completed
            </Text>
          )}
        </View>

        <View style={styles.pickerRow}>
          <ProjectPicker />
        </View>

        {!state.selectedProject && (
          <EmptyState
            icon='❐'
            title='Select a project'
            subtitle='Choose a project to manage subtasks'
          />
        )}
        {state.loading && <Text style={styles.loadingText}>Loading...</Text>}
        {state.selectedProject &&
          state.tasks.length === 0 &&
          !state.loading && (
            <EmptyState
              icon='◎'
              title='No tasks'
              subtitle='Create tasks first, then add subtasks to them'
            />
          )}

        {state.tasks.map((task: Task) => {
          const subs: Subtask[] = state.subtasks.filter((s: Subtask) => {
            const sTaskId =
              typeof s.task === 'string' ? s.task : (s.task as any)?._id;
            return sTaskId === task._id;
          });
          const isExpanded = expandedTasks.has(task._id);

          return (
            <Card key={task._id} style={{ marginBottom: 12 }}>
              {/* Task header - tappable to expand/collapse */}
              <TouchableOpacity
                style={styles.taskHeader}
                onPress={() => toggleExpand(task._id)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <View style={styles.taskMeta}>
                    <Badge label={task.status} variant={task.status} />
                    <Text style={styles.subCount}>
                      {subs.length} subtask{subs.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
                <Text style={styles.expandChevron}>
                  {isExpanded ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {isExpanded && (
                <>
                  {/* Subtask list */}
                  {subs.length === 0 && (
                    <Text style={styles.noSubs}>No subtasks yet.</Text>
                  )}
                  {subs.map((sub: Subtask) => (
                    <View key={sub._id} style={styles.subCard}>
                      <View style={styles.subRow}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                          <Text style={styles.subTitle}>{sub.title}</Text>
                          <View style={{ marginTop: 4 }}>
                            <Badge label={sub.status} variant={sub.status} />
                          </View>
                        </View>
                        <View style={styles.subActions}>
                          <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => {
                              setEditingSub(sub);
                              setEditData({
                                title: sub.title,
                                status: sub.status,
                              });
                            }}
                          >
                            <Text style={styles.editBtnText}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.delBtn}
                            onPress={() => handleDelete(sub._id)}
                            disabled={loadingId === sub._id}
                          >
                            <Text style={styles.delBtnText}>
                              {loadingId === sub._id ? '...' : 'Del'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}

                  {/* Add subtask row */}
                  <View style={styles.addRow}>
                    {addingForTask === task._id ? (
                      <View style={styles.addForm}>
                        <Input
                          placeholder='Subtask title'
                          value={newTitle}
                          onChangeText={setNewTitle}
                          containerStyle={{ marginBottom: 8 }}
                          autoFocus
                        />
                        <View style={styles.addFormBtns}>
                          <Button
                            title='Add'
                            onPress={() => handleAddSubtask(task._id)}
                            disabled={!newTitle.trim()}
                            style={{ flex: 1 }}
                            small
                          />
                          <Button
                            title='Cancel'
                            variant='ghost'
                            onPress={() => {
                              setAddingForTask(null);
                              setNewTitle('');
                            }}
                            style={{ flex: 1 }}
                            small
                          />
                        </View>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          setAddingForTask(task._id);
                          setNewTitle('');
                        }}
                      >
                        <Text style={styles.addSubLink}>+ Add subtask</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </Card>
          );
        })}
      </ScrollView>

      {/* Edit subtask modal */}
      <Modal visible={!!editingSub} animationType='slide' transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Edit Subtask</Text>
              {editingSub && (
                <>
                  <Input
                    label='Title'
                    value={editData.title}
                    onChangeText={(v) => setEditData({ ...editData, title: v })}
                    autoFocus
                  />
                  <Text style={styles.fieldLabel}>Status</Text>
                  <View style={styles.statusRow}>
                    {STATUS_OPTIONS.map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.statusBtn,
                          editData.status === s && styles.statusBtnActive,
                        ]}
                        onPress={() => setEditData({ ...editData, status: s })}
                      >
                        <Text
                          style={[
                            styles.statusBtnText,
                            editData.status === s && styles.statusBtnTextActive,
                          ]}
                        >
                          {s}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {editData.status === 'Done' &&
                    editingSub.status !== 'Done' && (
                      <View style={styles.xpHint}>
                        <Text style={styles.xpHintText}>
                          ✦ Completing will award +3 XP
                        </Text>
                      </View>
                    )}
                  <View style={styles.modalBtns}>
                    <Button
                      title='Cancel'
                      variant='secondary'
                      onPress={() => setEditingSub(null)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title={loadingId ? 'Saving...' : 'Save'}
                      onPress={handleEditSave}
                      loading={!!loadingId}
                      style={{ flex: 1 }}
                    />
                  </View>
                </>
              )}
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
  heroTitle: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  heroSub: { color: '#93c5fd', fontSize: 12, marginTop: 3 },
  pickerRow: { marginBottom: 14 },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  taskHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 5,
  },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  subCount: { fontSize: 11, color: Colors.textMuted },
  expandChevron: { fontSize: 11, color: Colors.textMuted, marginLeft: 8 },
  noSubs: { fontSize: 12, color: Colors.textLight, paddingVertical: 6 },
  subCard: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subRow: { flexDirection: 'row', alignItems: 'flex-start' },
  subTitle: { fontSize: 13, color: Colors.text, fontWeight: '500' },
  subActions: { flexDirection: 'row', gap: 6 },
  editBtn: {
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  editBtnText: { color: Colors.accent, fontSize: 11, fontWeight: '600' },
  delBtn: {
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  delBtnText: { color: Colors.error, fontSize: 11, fontWeight: '600' },
  addRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addForm: { gap: 0 },
  addFormBtns: { flexDirection: 'row', gap: 8 },
  addSubLink: { fontSize: 12, color: Colors.primaryLight, fontWeight: '600' },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statusBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
  },
  statusBtnActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },
  statusBtnText: { fontSize: 11, fontWeight: '600', color: Colors.textMuted },
  statusBtnTextActive: { color: Colors.white },
  xpHint: {
    backgroundColor: '#dcfce7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  xpHintText: { color: '#15803d', fontSize: 12, fontWeight: '600' },
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
