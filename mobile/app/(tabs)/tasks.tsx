import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../context/GlobalContext';
import {
  fetchTasks,
  addTask,
  updateTask,
  completeTask,
  deleteTask,
} from '../../context/Actions';
import { Colors } from '../../constants/Colors';
import {
  Button,
  Badge,
  Card,
  EmptyState,
  HeroBanner,
  Toast,
  Input,
} from '../../components/ui';
import { ProjectPicker } from '../../components/ProjectPicker';
import { useRouter } from 'expo-router';

type Task = {
  _id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Done';
  deadline?: string;
  assignedTo?: { username: string } | null;
};
const STATUS_OPTIONS: Task['status'][] = ['Open', 'InProgress', 'Done'];

export default function TasksScreen() {
  const { state, dispatch } = useGlobalContext();
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    status: 'Open' as Task['status'],
  });
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    deadline: '',
    status: 'Open' as Task['status'],
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (state.token && state.selectedProject?._id) {
      fetchTasks(dispatch, state.token, state.selectedProject._id);
    }
  }, [state.selectedProject?._id]);

  if (!state.user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.centeredText}>Sign in to manage tasks</Text>
          <Button
            title='Sign in'
            onPress={() => router.push('/sign')}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAdd = async () => {
    if (!newTask.title.trim() || !state.token || !state.selectedProject?._id)
      return;
    await addTask(dispatch, state.token, {
      title: newTask.title.trim(),
      project: state.selectedProject._id,
      status: newTask.status,
      ...(newTask.deadline ? { deadline: newTask.deadline } : {}),
    });
    setNewTask({ title: '', deadline: '', status: 'Open' });
    setShowAdd(false);
  };

  const handleEditSave = async () => {
    if (!editTask || !state.token) return;
    setLoadingId(editTask._id);
    const becomingDone =
      editData.status === 'Done' && editTask.status !== 'Done';
    if (becomingDone) {
      await completeTask(dispatch, state.token, editTask._id, {
        title: editData.title.trim(),
      });
      showToast('✦ Task completed! +5 XP awarded');
    } else {
      await updateTask(dispatch, state.token, editTask._id, {
        title: editData.title.trim(),
        status: editData.status,
        ...(editData.deadline ? { deadline: editData.deadline } : {}),
      });
    }
    setLoadingId(null);
    setEditTask(null);
  };

  const handleDelete = (taskId: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!state.token) return;
          setLoadingId(taskId);
          await deleteTask(dispatch, state.token, taskId);
          setLoadingId(null);
        },
      },
    ]);
  };

  const done = state.tasks.filter((t: Task) => t.status === 'Done').length;

  return (
    <SafeAreaView style={styles.safe}>
      {toast && <Toast message={toast} />}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Tasks</Text>
          </View>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>
                {state.selectedProject
                  ? state.selectedProject.name
                  : 'Select a project'}
              </Text>
              {state.selectedProject && state.tasks.length > 0 && (
                <Text style={styles.heroSub}>
                  {done} of {state.tasks.length} completed
                </Text>
              )}
            </View>
            {state.selectedProject && (
              <TouchableOpacity
                style={styles.heroBtn}
                onPress={() => setShowAdd(!showAdd)}
              >
                <Text style={styles.heroBtnText}>
                  {showAdd ? 'Cancel' : '+ New'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Project picker */}
        <View style={styles.pickerRow}>
          <ProjectPicker />
        </View>

        {/* Add form */}
        {showAdd && (
          <Card style={styles.addCard}>
            <Text style={styles.cardTitle}>New task</Text>
            <Input
              label='Title'
              placeholder='Task title'
              value={newTask.title}
              onChangeText={(v) => setNewTask({ ...newTask, title: v })}
            />
            <Input
              label='Deadline (YYYY-MM-DD, optional)'
              placeholder='2025-12-31'
              value={newTask.deadline}
              onChangeText={(v) => setNewTask({ ...newTask, deadline: v })}
            />
            <Text style={styles.fieldLabel}>Status</Text>
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusBtn,
                    newTask.status === s && styles.statusBtnActive,
                  ]}
                  onPress={() => setNewTask({ ...newTask, status: s })}
                >
                  <Text
                    style={[
                      styles.statusBtnText,
                      newTask.status === s && styles.statusBtnTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button
              title='Add task'
              onPress={handleAdd}
              disabled={!newTask.title.trim()}
              style={{ marginTop: 8 }}
            />
          </Card>
        )}

        {!state.selectedProject && (
          <EmptyState
            icon='❐'
            title='Select a project'
            subtitle='Choose a project from the picker above'
          />
        )}
        {state.loading && (
          <Text style={styles.loadingText}>Loading tasks...</Text>
        )}

        {state.tasks.map((task: Task) => (
          <Card key={task._id}>
            <View style={styles.taskRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={styles.taskMeta}>
                  <Badge label={task.status} variant={task.status} />
                  {task.assignedTo && (
                    <Text style={styles.assignee}>
                      👤 {task.assignedTo.username}
                    </Text>
                  )}
                  {task.deadline && (
                    <Text style={styles.deadline}>
                      📅{' '}
                      {new Date(task.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.taskActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => {
                    setEditTask(task);
                    setEditData({
                      title: task.title,
                      deadline: task.deadline ? task.deadline.slice(0, 10) : '',
                      status: task.status,
                    });
                  }}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.delBtn}
                  onPress={() => handleDelete(task._id)}
                  disabled={loadingId === task._id}
                >
                  <Text style={styles.delBtnText}>
                    {loadingId === task._id ? '...' : 'Del'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}

        {!state.loading &&
          state.selectedProject &&
          state.tasks.length === 0 && (
            <EmptyState
              icon='◎'
              title='No tasks yet'
              subtitle='Add your first task above'
            />
          )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={!!editTask} transparent animationType='slide'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Edit Task</Text>
            {editTask && (
              <>
                <Input
                  label='Title'
                  value={editData.title}
                  onChangeText={(v) => setEditData({ ...editData, title: v })}
                />
                <Input
                  label='Deadline'
                  value={editData.deadline}
                  onChangeText={(v) =>
                    setEditData({ ...editData, deadline: v })
                  }
                  placeholder='YYYY-MM-DD'
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
                {editData.status === 'Done' && editTask.status !== 'Done' && (
                  <View style={styles.xpHint}>
                    <Text style={styles.xpHintText}>
                      ✦ Completing this task will award +5 XP
                    </Text>
                  </View>
                )}
                <View style={styles.modalBtns}>
                  <Button
                    title='Cancel'
                    variant='secondary'
                    onPress={() => setEditTask(null)}
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
        </View>
      </Modal>
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
  addCard: { marginBottom: 12 },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 6,
  },
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  statusBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
  },
  statusBtnActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },
  statusBtnText: { fontSize: 11, fontWeight: '600', color: Colors.textMuted },
  statusBtnTextActive: { color: Colors.white },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start' },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  assignee: { fontSize: 11, color: Colors.textMuted },
  deadline: { fontSize: 11, color: Colors.textLight },
  taskActions: { gap: 6 },
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
  xpHint: {
    backgroundColor: '#dcfce7',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  xpHintText: { color: '#15803d', fontSize: 12, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
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
