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

import { useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { addProject } from '../../Context/Actions';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface Task {
  description: string;
  subtasks: string[];
}
interface TaskGroup {
  name: string;
  deadline: string;
  tasks: Task[];
}

const CreateProject = () => {
  const { state, dispatch } = useGlobalContext();

  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<'github' | 'manual' | ''>('');

  // GitHub state
  const [githubToken, setGithubToken] = useState('');
  const [githubOwner, setGithubOwner] = useState('');
  const [repos, setRepos] = useState<string[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [githubContributors, setGithubContributors] = useState<string[]>([]);
  const [newGithubContributor, setNewGithubContributor] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');

  // Manual state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contributors, setContributors] = useState<string[]>([]);
  const [newContributor, setNewContributor] = useState('');
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([]);
  const [newTaskGroup, setNewTaskGroup] = useState<TaskGroup>({
    name: '',
    deadline: '',
    tasks: [],
  });
  const [newTask, setNewTask] = useState<Task>({
    description: '',
    subtasks: [],
  });
  const [newSubtask, setNewSubtask] = useState('');

  const handleAddContributor = () => {
    if (newContributor.trim()) {
      setContributors([...contributors, newContributor.trim()]);
      setNewContributor('');
    }
  };
  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setNewTask({
        ...newTask,
        subtasks: [...newTask.subtasks, newSubtask.trim()],
      });
      setNewSubtask('');
    }
  };
  const handleAddTask = () => {
    if (newTask.description.trim()) {
      setNewTaskGroup({
        ...newTaskGroup,
        tasks: [...newTaskGroup.tasks, newTask],
      });
      setNewTask({ description: '', subtasks: [] });
    }
  };
  const handleAddTaskGroup = () => {
    if (newTaskGroup.name.trim() && newTaskGroup.deadline) {
      setTaskGroups([...taskGroups, newTaskGroup]);
      setNewTaskGroup({ name: '', deadline: '', tasks: [] });
    }
  };

  const handleSubmitManual = async () => {
    if (!state.token) return alert('You must be logged in.');
    await addProject(dispatch, state.token, {
      name,
      description,
      contributors,
      taskGroups,
    });
    alert('Project created successfully!');
    resetAll();
  };

  const handleFetchRepos = async () => {
    if (!githubOwner || !githubToken) {
      setGithubError('Username and token are required');
      return;
    }
    setGithubLoading(true);
    setGithubError('');
    try {
      const res = await axios.get(`${API_URL}/github/user/repos/names`, {
        headers: { Authorization: `Bearer ${githubToken}` },
      });
      setRepos(res.data);
      setStep(1);
    } catch (err: any) {
      setGithubError(err.response?.data?.message || 'Failed to fetch repos');
    } finally {
      setGithubLoading(false);
    }
  };

  const handleSubmitGithub = async () => {
    if (!state.token || !githubOwner || !githubToken || !selectedRepo) return;
    setGithubLoading(true);
    setGithubError('');
    try {
      const issuesRes = await axios.get(
        `${API_URL}/github/${githubOwner}/${selectedRepo}/issues`,
        {
          headers: { Authorization: `Bearer ${githubToken}` },
        },
      );
      const taskGroup: TaskGroup = {
        name: selectedRepo,
        deadline: '',
        tasks: issuesRes.data.map((i: any) => ({
          description: i.title,
          subtasks: [],
        })),
      };
      await addProject(dispatch, state.token, {
        name: selectedRepo,
        description: `Imported from GitHub: ${githubOwner}/${selectedRepo}`,
        contributors: githubContributors,
        taskGroups: [taskGroup],
      });
      alert('Project created from GitHub successfully!');
      resetAll();
    } catch (err: any) {
      setGithubError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setGithubLoading(false);
    }
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

  const stepLabel =
    projectType === 'github'
      ? ['Connect GitHub', 'Select Repo', 'Add Contributors'][step]
      : projectType === 'manual'
        ? ['', 'Project Details', 'Task Groups'][step]
        : 'Create Project';

  return (
    <div className='h-full overflow-auto'>
      {/* Hero*/}
      <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden'>
        <div className='absolute -top-6 -right-6 w-44 h-44 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10'>
          <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-2 tracking-wide'>
            New Project
          </div>
          <h1 className='text-2xl font-bold text-white'>{stepLabel}</h1>
          <p className='text-blue-300 text-xs mt-1'>
            Create a project manually or import directly from GitHub.
          </p>
        </div>
        {/* Step indicator */}
        {projectType && (
          <div className='relative z-10 flex gap-2 mt-4'>
            {(projectType === 'github' ? [0, 1, 2] : [1, 2]).map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s <= step ? 'bg-white w-8' : 'bg-blue-600 w-4'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className='px-6 py-5'>
        {/* STEP 0: Choose type*/}
        {step === 0 && (
          <div className='flex flex-col gap-4 max-w-md'>
            <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest'>
              Choose import method
            </p>

            <div className='flex flex-col gap-3'>
              <div className='flex flex-col gap-2'>
                <label className='text-xs text-gray-500'>GitHub username</label>
                <input
                  type='text'
                  placeholder='e.g. octocat'
                  value={githubOwner}
                  onChange={(e) => setGithubOwner(e.target.value)}
                  className='p-2 border border-blue-200 rounded-xl text-sm'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-xs text-gray-500'>
                  GitHub personal access token
                </label>
                <input
                  type='password'
                  placeholder='ghp_...'
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className='p-2 border border-blue-200 rounded-xl text-sm'
                />
              </div>
            </div>

            <button
              className='bg-blue-700 text-white text-sm font-medium py-2.5 rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-colors'
              onClick={() => {
                setProjectType('github');
                handleFetchRepos();
              }}
              disabled={githubLoading}
            >
              {githubLoading
                ? 'Fetching repositories...'
                : '⊞ Import from GitHub'}
            </button>

            <div className='flex items-center gap-3'>
              <div className='flex-1 h-px bg-blue-100' />
              <span className='text-xs text-gray-400'>or</span>
              <div className='flex-1 h-px bg-blue-100' />
            </div>

            <button
              className='border-2 border-blue-200 text-blue-700 text-sm font-medium py-2.5 rounded-2xl hover:bg-blue-50 transition-colors'
              onClick={() => {
                setProjectType('manual');
                setStep(1);
              }}
            >
              ✎ Create manually
            </button>

            {githubError && (
              <div className='bg-red-50 border border-red-200 rounded-xl px-3 py-2'>
                <p className='text-sm text-red-600'>{githubError}</p>
              </div>
            )}
          </div>
        )}

        {/*GITHUB STEP 1: select repo*/}
        {step === 1 && projectType === 'github' && (
          <div className='flex flex-col gap-3 max-w-md'>
            <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1'>
              {repos.length} repositories found
            </p>
            <div className='flex flex-col gap-2'>
              {repos.map((repo) => (
                <button
                  key={repo}
                  className='w-full text-left bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl p-3 text-sm font-medium text-gray-700 transition-colors'
                  onClick={() => {
                    setSelectedRepo(repo);
                    setStep(2);
                  }}
                >
                  ⊞ {repo}
                </button>
              ))}
            </div>
            <button
              className='text-xs text-gray-400 hover:text-gray-600 mt-2'
              onClick={resetAll}
            >
              ← Back
            </button>
          </div>
        )}

        {/* GITHUB STEP 2: contributors */}
        {step === 2 && projectType === 'github' && (
          <div className='flex flex-col gap-4 max-w-md'>
            <div className='bg-blue-50 border border-blue-200 rounded-xl px-4 py-3'>
              <p className='text-sm font-semibold text-gray-700'>
                ⊞ {selectedRepo}
              </p>
              <p className='text-xs text-gray-400 mt-0.5'>
                All open issues will be imported as tasks.
              </p>
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-xs font-semibold text-gray-600'>
                Contributors (optional)
              </label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  placeholder='GitHub username'
                  value={newGithubContributor}
                  onChange={(e) => setNewGithubContributor(e.target.value)}
                  className='flex-1 p-2 border border-blue-200 rounded-xl text-sm'
                />
                <button
                  onClick={() => {
                    if (newGithubContributor.trim()) {
                      setGithubContributors([
                        ...githubContributors,
                        newGithubContributor.trim(),
                      ]);
                      setNewGithubContributor('');
                    }
                  }}
                  className='bg-blue-700 text-white text-sm px-3 rounded-xl hover:bg-blue-600 transition-colors'
                >
                  Add
                </button>
              </div>
              {githubContributors.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-1'>
                  {githubContributors.map((c, i) => (
                    <span
                      key={i}
                      className='text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full'
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {githubError && (
              <div className='bg-red-50 border border-red-200 rounded-xl px-3 py-2'>
                <p className='text-sm text-red-600'>{githubError}</p>
              </div>
            )}

            <div className='flex gap-2'>
              <button
                className='text-xs text-gray-400 hover:text-gray-600 px-3 py-2'
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                onClick={handleSubmitGithub}
                disabled={githubLoading}
                className='flex-1 bg-blue-700 text-white text-sm font-medium py-2.5 rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-colors'
              >
                {githubLoading ? 'Creating...' : 'Create Project from GitHub'}
              </button>
            </div>
          </div>
        )}

        {/* MANUAL STEP 1: details*/}
        {step === 1 && projectType === 'manual' && (
          <div className='flex flex-col gap-4 max-w-md'>
            <div className='flex flex-col gap-2'>
              <label className='text-xs text-gray-500'>Project name</label>
              <input
                type='text'
                placeholder='My awesome project'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='p-2 border border-blue-200 rounded-xl text-sm'
                autoFocus
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-xs text-gray-500'>
                Description (optional)
              </label>
              <textarea
                placeholder='What is this project about?'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className='p-2 border border-blue-200 rounded-xl text-sm resize-none'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-xs font-semibold text-gray-600'>
                Contributors (optional)
              </label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  placeholder='Username'
                  value={newContributor}
                  onChange={(e) => setNewContributor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddContributor()}
                  className='flex-1 p-2 border border-blue-200 rounded-xl text-sm'
                />
                <button
                  onClick={handleAddContributor}
                  className='bg-blue-700 text-white text-sm px-3 rounded-xl hover:bg-blue-600 transition-colors'
                >
                  Add
                </button>
              </div>
              {contributors.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-1'>
                  {contributors.map((c, i) => (
                    <span
                      key={i}
                      className='text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full'
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className='bg-blue-700 text-white text-sm font-medium py-2.5 rounded-2xl hover:bg-blue-600 disabled:opacity-40 transition-colors'
            >
              Next: Task Groups →
            </button>
          </div>
        )}

        {/*MANUAL STEP 2: task groups*/}
        {step === 2 && projectType === 'manual' && (
          <div className='flex flex-col gap-5 max-w-lg'>
            {/* New task group form */}
            <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col gap-3'>
              <p className='text-sm font-semibold text-gray-700'>
                Add task group
              </p>
              <div className='flex gap-3'>
                <div className='flex flex-col gap-1 flex-1'>
                  <label className='text-xs text-gray-500'>Group name</label>
                  <input
                    type='text'
                    placeholder='e.g. Sprint 1'
                    value={newTaskGroup.name}
                    onChange={(e) =>
                      setNewTaskGroup({ ...newTaskGroup, name: e.target.value })
                    }
                    className='p-2 border border-blue-200 rounded-xl text-sm'
                  />
                </div>
                <div className='flex flex-col gap-1 flex-1'>
                  <label className='text-xs text-gray-500'>Deadline</label>
                  <input
                    type='date'
                    value={newTaskGroup.deadline}
                    onChange={(e) =>
                      setNewTaskGroup({
                        ...newTaskGroup,
                        deadline: e.target.value,
                      })
                    }
                    className='p-2 border border-blue-200 rounded-xl text-sm'
                  />
                </div>
              </div>

              {/* Add task to group */}
              <div className='border border-blue-200 rounded-xl p-3 flex flex-col gap-2 bg-white'>
                <p className='text-xs font-medium text-gray-600'>Add task</p>
                <input
                  type='text'
                  placeholder='Task description'
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className='p-2 border border-blue-100 rounded-lg text-sm'
                />
                <div className='flex gap-2'>
                  <input
                    type='text'
                    placeholder='Subtask'
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                    className='flex-1 p-2 border border-blue-100 rounded-lg text-sm'
                  />
                  <button
                    onClick={handleAddSubtask}
                    className='text-xs bg-blue-100 text-blue-700 px-3 rounded-lg hover:bg-blue-200 transition-colors'
                  >
                    + Subtask
                  </button>
                </div>
                {newTask.subtasks.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {newTask.subtasks.map((s, i) => (
                      <span
                        key={i}
                        className='text-xs bg-blue-50 border border-blue-200 text-blue-600 px-2 py-0.5 rounded-full'
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={handleAddTask}
                  disabled={!newTask.description.trim()}
                  className='bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-colors self-start'
                >
                  Add task to group
                </button>
              </div>

              {newTaskGroup.tasks.length > 0 && (
                <div className='flex flex-col gap-1'>
                  {newTaskGroup.tasks.map((t, i) => (
                    <div
                      key={i}
                      className='text-xs text-gray-600 flex items-center gap-2'
                    >
                      <span className='w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0' />
                      {t.description}
                      {t.subtasks.length > 0 && (
                        <span className='text-gray-400'>
                          ({t.subtasks.length} subtasks)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleAddTaskGroup}
                disabled={!newTaskGroup.name.trim() || !newTaskGroup.deadline}
                className='border border-blue-300 text-blue-700 text-sm py-2 rounded-xl hover:bg-blue-100 disabled:opacity-40 transition-colors'
              >
                + Add task group
              </button>
            </div>

            {/* Added task groups */}
            {taskGroups.length > 0 && (
              <div className='flex flex-col gap-2'>
                <p className='text-xs font-semibold text-gray-600'>
                  {taskGroups.length} task group
                  {taskGroups.length > 1 ? 's' : ''} added
                </p>
                {taskGroups.map((tg, i) => (
                  <div
                    key={i}
                    className='bg-white border border-blue-200 rounded-xl px-3 py-2 flex items-center justify-between'
                  >
                    <span className='text-sm font-medium text-gray-700'>
                      {tg.name}
                    </span>
                    <span className='text-xs text-gray-400'>
                      {tg.tasks.length} task{tg.tasks.length !== 1 ? 's' : ''} ·{' '}
                      {tg.deadline}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className='flex gap-2'>
              <button
                className='text-xs text-gray-400 hover:text-gray-600 px-3 py-2'
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                onClick={handleSubmitManual}
                className='flex-1 bg-blue-700 text-white text-sm font-medium py-2.5 rounded-2xl hover:bg-blue-600 transition-colors'
              >
                Create Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProject;
