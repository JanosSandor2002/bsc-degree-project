import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGlobalContext } from '../context/GlobalContext';
import {
  addProject,
  fetchGithubRepos,
  fetchGithubIssues,
} from '../context/Actions';
import { Colors } from '../constants/Colors';
import { Button, Input, Card, Toast } from '../components/ui';

interface TaskItem {
  description: string;
  subtasks: string[];
}
interface TaskGroup {
  name: string;
  deadline: string;
  tasks: TaskItem[];
}

export default function CreateProjectScreen() {
  const { state, dispatch } = useGlobalContext();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<'github' | 'manual' | ''>('');

  // GitHub
  const [githubToken, setGithubToken] = useState('');
  const [githubOwner, setGithubOwner] = useState('');
  const [repos, setRepos] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [githubContributors, setGithubContributors] = useState<string[]>([]);
  const [newGithubContrib, setNewGithubContrib] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');

  // Manual
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contributors, setContributors] = useState<string[]>([]);
  const [newContrib, setNewContrib] = useState('');
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [newTaskGroup, setNewTaskGroup] = useState<TaskGroup>({
    name: '',
    deadline: '',
    tasks: [],
  });
  const [newTask, setNewTask] = useState<TaskItem>({
    description: '',
    subtasks: [],
  });
  const [newSubtask, setNewSubtask] = useState('');

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const resetAll = () => {
    setStep(0);
    setProjectType('');
    setName('');
    setDescription('');
    setContributors([]);
    setTaskGroups([]);
    setRepos([]);
    setSelectedRepo('');
    setGithubContributors([]);
    setGithubError('');
    setGithubOwner('');
    setGithubToken('');
  };

  const handleFetchRepos = async () => {
    if (!githubOwner || !githubToken) {
      setGithubError('Username and token are required');
      return;
    }
    setGithubLoading(true);
    setGithubError('');
    try {
      const data = await fetchGithubRepos(githubToken);
      setRepos(data);
      setStep(1);
    } catch (err: any) {
      setGithubError(err.message || 'Failed to fetch repos');
    } finally {
      setGithubLoading(false);
    }
  };

  const handleSubmitGithub = async () => {
    if (!state.token || !githubOwner || !githubToken || !selectedRepo) return;
    setGithubLoading(true);
    setGithubError('');
    try {
      const issues = await fetchGithubIssues(
        githubToken,
        githubOwner,
        selectedRepo,
      );
      const taskGroup: TaskGroup = {
        name: selectedRepo,
        deadline: '',
        tasks: issues.map((i: any) => ({ description: i.title, subtasks: [] })),
      };
      await addProject(dispatch, state.token, {
        name: selectedRepo,
        description: `Imported from GitHub: ${githubOwner}/${selectedRepo}`,
        contributors: githubContributors,
        taskGroups: [taskGroup],
      });
      showToast('Project created from GitHub!');
      setTimeout(() => {
        resetAll();
        router.back();
      }, 1500);
    } catch (err: any) {
      setGithubError(err.message || 'Failed to create project');
    } finally {
      setGithubLoading(false);
    }
  };

  const handleSubmitManual = async () => {
    if (!state.token) return;
    await addProject(dispatch, state.token, {
      name,
      description,
      contributors,
      taskGroups,
    });
    showToast('Project created successfully!');
    setTimeout(() => {
      resetAll();
      router.back();
    }, 1500);
  };

  const stepLabel =
    projectType === 'github'
      ? ['Connect GitHub', 'Select Repo', 'Add Contributors'][step]
      : projectType === 'manual'
        ? ['', 'Project Details', 'Task Groups'][step]
        : 'Create Project';

  return (
    <SafeAreaView style={styles.safe}>
      {toast && <Toast message={toast} />}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps='handled'
        >
          {/* Hero */}
          <View style={styles.hero}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>New Project</Text>
            </View>
            <Text style={styles.heroTitle}>
              {stepLabel || 'Create Project'}
            </Text>
            <Text style={styles.heroSub}>
              Create manually or import from GitHub.
            </Text>
            {projectType && (
              <View style={styles.stepDots}>
                {(projectType === 'github' ? [0, 1, 2] : [1, 2]).map((s) => (
                  <View
                    key={s}
                    style={[styles.stepDot, s <= step && styles.stepDotActive]}
                  />
                ))}
              </View>
            )}
          </View>
          {step === 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>CHOOSE IMPORT METHOD</Text>
              <Input
                label='GitHub username'
                placeholder='e.g. octocat'
                value={githubOwner}
                onChangeText={setGithubOwner}
                autoCapitalize='none'
              />
              <Input
                label='GitHub personal access token'
                placeholder='ghp_...'
                value={githubToken}
                onChangeText={setGithubToken}
                secureTextEntry
                autoCapitalize='none'
              />
              <Button
                title={
                  githubLoading
                    ? 'Fetching repositories...'
                    : '⊞ Import from GitHub'
                }
                onPress={() => {
                  setProjectType('github');
                  handleFetchRepos();
                }}
                loading={githubLoading}
              />
              {githubError && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{githubError}</Text>
                </View>
              )}
              <View style={styles.dividerRow}>
                <View style={styles.divLine} />
                <Text style={styles.divText}>or</Text>
                <View style={styles.divLine} />
              </View>
              <Button
                title='✎ Create manually'
                variant='secondary'
                onPress={() => {
                  setProjectType('manual');
                  setStep(1);
                }}
              />
            </View>
          )}

          {step === 1 && projectType === 'github' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {repos.length} REPOSITORIES FOUND
              </Text>
              {repos.map((repo) => (
                <TouchableOpacity
                  key={repo}
                  style={styles.repoItem}
                  onPress={() => {
                    setSelectedRepo(repo);
                    setStep(2);
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={styles.repoText}>⊞ {repo}</Text>
                  <Text style={styles.repoChevron}>›</Text>
                </TouchableOpacity>
              ))}
              <Button title='← Back' variant='ghost' onPress={resetAll} />
            </View>
          )}

          {step === 2 && projectType === 'github' && (
            <View style={styles.section}>
              <Card>
                <Text style={styles.repoSelected}>⊞ {selectedRepo}</Text>
                <Text style={styles.repoNote}>
                  All open issues will be imported as tasks.
                </Text>
              </Card>
              <Text style={styles.fieldLabel}>Contributors (optional)</Text>
              <View style={styles.addRow}>
                <Input
                  placeholder='GitHub username'
                  value={newGithubContrib}
                  onChangeText={setNewGithubContrib}
                  containerStyle={{ flex: 1, marginBottom: 0 }}
                  autoCapitalize='none'
                />
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => {
                    if (newGithubContrib.trim()) {
                      setGithubContributors([
                        ...githubContributors,
                        newGithubContrib.trim(),
                      ]);
                      setNewGithubContrib('');
                    }
                  }}
                >
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
              {githubContributors.length > 0 && (
                <View style={styles.chips}>
                  {githubContributors.map((c, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{c}</Text>
                    </View>
                  ))}
                </View>
              )}
              {githubError && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{githubError}</Text>
                </View>
              )}
              <View style={styles.btnRow}>
                <Button
                  title='← Back'
                  variant='ghost'
                  onPress={() => setStep(1)}
                  style={{ flex: 1 }}
                />
                <Button
                  title={githubLoading ? 'Creating...' : 'Create from GitHub'}
                  onPress={handleSubmitGithub}
                  loading={githubLoading}
                  style={{ flex: 2 }}
                />
              </View>
            </View>
          )}

          {step === 1 && projectType === 'manual' && (
            <View style={styles.section}>
              <Input
                label='Project name'
                placeholder='My awesome project'
                value={name}
                onChangeText={setName}
                autoFocus
              />
              <Input
                label='Description (optional)'
                placeholder='What is this project about?'
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: 'top' } as any}
              />
              <Text style={styles.fieldLabel}>Contributors (optional)</Text>
              <View style={styles.addRow}>
                <Input
                  placeholder='Username'
                  value={newContrib}
                  onChangeText={setNewContrib}
                  containerStyle={{ flex: 1, marginBottom: 0 }}
                  autoCapitalize='none'
                />
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => {
                    if (newContrib.trim()) {
                      setContributors([...contributors, newContrib.trim()]);
                      setNewContrib('');
                    }
                  }}
                >
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
              {contributors.length > 0 && (
                <View style={styles.chips}>
                  {contributors.map((c, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{c}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Button
                title='Next: Task Groups →'
                onPress={() => setStep(2)}
                disabled={!name.trim()}
                style={{ marginTop: 8 }}
              />
            </View>
          )}

          {step === 2 && projectType === 'manual' && (
            <View style={styles.section}>
              {/* Task group builder */}
              <Card>
                <Text style={styles.cardTitle}>Add task group</Text>
                <Input
                  label='Group name'
                  placeholder='e.g. Sprint 1'
                  value={newTaskGroup.name}
                  onChangeText={(v) =>
                    setNewTaskGroup({ ...newTaskGroup, name: v })
                  }
                />
                <Input
                  label='Deadline (YYYY-MM-DD)'
                  placeholder='2025-12-31'
                  value={newTaskGroup.deadline}
                  onChangeText={(v) =>
                    setNewTaskGroup({ ...newTaskGroup, deadline: v })
                  }
                />

                {/* Add task */}
                <Text style={styles.fieldLabel}>Add a task</Text>
                <Input
                  placeholder='Task description'
                  value={newTask.description}
                  onChangeText={(v) =>
                    setNewTask({ ...newTask, description: v })
                  }
                />
                <View style={styles.addRow}>
                  <Input
                    placeholder='Subtask'
                    value={newSubtask}
                    onChangeText={setNewSubtask}
                    containerStyle={{ flex: 1, marginBottom: 0 }}
                  />
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                      if (newSubtask.trim()) {
                        setNewTask({
                          ...newTask,
                          subtasks: [...newTask.subtasks, newSubtask.trim()],
                        });
                        setNewSubtask('');
                      }
                    }}
                  >
                    <Text style={styles.addBtnText}>+ Sub</Text>
                  </TouchableOpacity>
                </View>
                {newTask.subtasks.length > 0 && (
                  <View style={styles.chips}>
                    {newTask.subtasks.map((s, i) => (
                      <View key={i} style={styles.chip}>
                        <Text style={styles.chipText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <Button
                  title='Add task to group'
                  variant='secondary'
                  onPress={() => {
                    if (newTask.description.trim()) {
                      setNewTaskGroup({
                        ...newTaskGroup,
                        tasks: [...newTaskGroup.tasks, newTask],
                      });
                      setNewTask({ description: '', subtasks: [] });
                    }
                  }}
                  disabled={!newTask.description.trim()}
                  style={{ marginTop: 6 }}
                  small
                />

                {newTaskGroup.tasks.length > 0 && (
                  <View style={styles.taskList}>
                    {newTaskGroup.tasks.map((t, i) => (
                      <View key={i} style={styles.taskListItem}>
                        <View style={styles.taskListDot} />
                        <Text style={styles.taskListText}>{t.description}</Text>
                        {t.subtasks.length > 0 && (
                          <Text style={styles.taskListSubs}>
                            ({t.subtasks.length} sub)
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                <Button
                  title='+ Add task group'
                  variant='secondary'
                  onPress={() => {
                    if (newTaskGroup.name.trim() && newTaskGroup.deadline) {
                      setTaskGroups([...taskGroups, newTaskGroup]);
                      setNewTaskGroup({ name: '', deadline: '', tasks: [] });
                    }
                  }}
                  disabled={!newTaskGroup.name.trim() || !newTaskGroup.deadline}
                  style={{ marginTop: 10 }}
                />
              </Card>

              {/* Added groups */}
              {taskGroups.length > 0 && (
                <View style={styles.groupList}>
                  <Text style={styles.fieldLabel}>
                    {taskGroups.length} task group
                    {taskGroups.length > 1 ? 's' : ''} added
                  </Text>
                  {taskGroups.map((tg, i) => (
                    <View key={i} style={styles.groupCard}>
                      <Text style={styles.groupName}>{tg.name}</Text>
                      <Text style={styles.groupMeta}>
                        {tg.tasks.length} task{tg.tasks.length !== 1 ? 's' : ''}{' '}
                        · {tg.deadline}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.btnRow}>
                <Button
                  title='← Back'
                  variant='ghost'
                  onPress={() => setStep(1)}
                  style={{ flex: 1 }}
                />
                <Button
                  title='Create Project'
                  onPress={handleSubmitManual}
                  style={{ flex: 2 }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  hero: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  backBtn: { marginBottom: 10 },
  backBtnText: { color: '#93c5fd', fontSize: 13, fontWeight: '500' },
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
  heroSub: { color: '#93c5fd', fontSize: 13 },
  stepDots: { flexDirection: 'row', gap: 8, marginTop: 14 },
  stepDot: {
    height: 5,
    width: 16,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  stepDotActive: { backgroundColor: Colors.white, width: 28 },
  section: { gap: 0 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 8,
    marginTop: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    justifyContent: 'center',
  },
  addBtnText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  chip: {
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: { color: Colors.primaryLight, fontSize: 12, fontWeight: '500' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorText: { color: Colors.error, fontSize: 12 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 14,
  },
  divLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  divText: { fontSize: 12, color: Colors.textMuted },
  repoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  repoText: { fontSize: 14, fontWeight: '500', color: Colors.text },
  repoChevron: { fontSize: 18, color: Colors.textMuted },
  repoSelected: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  repoNote: { fontSize: 12, color: Colors.textMuted },
  taskList: { marginTop: 8 },
  taskListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  taskListDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  taskListText: { fontSize: 12, color: Colors.textMuted, flex: 1 },
  taskListSubs: { fontSize: 11, color: Colors.textLight },
  groupList: { marginTop: 4, marginBottom: 4 },
  groupCard: {
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
  groupName: { fontSize: 13, fontWeight: '600', color: Colors.text },
  groupMeta: { fontSize: 11, color: Colors.textMuted },
});
