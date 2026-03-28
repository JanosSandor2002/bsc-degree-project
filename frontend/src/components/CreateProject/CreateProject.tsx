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

  // ─── Manual handlers ───────────────────────────────────────────
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
  // Manual submit
  const handleSubmitManual = async () => {
    const token = state.token;
    if (!token) {
      alert('You must be logged in to create a project.');
      return;
    }
    const projectData = { name, description, contributors, taskGroups };
    await addProject(dispatch, token, projectData);
    alert('Project created successfully!');
    resetAll();
  };

  // ─── GitHub handlers ───────────────────────────────────────────
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

  const handleSelectRepo = (repoName: string) => {
    setSelectedRepo(repoName);
    setStep(2);
  };

  const handleAddGithubContributor = () => {
    if (newGithubContributor.trim()) {
      setGithubContributors([
        ...githubContributors,
        newGithubContributor.trim(),
      ]);
      setNewGithubContributor('');
    }
  };

  const handleSubmitGithub = async () => {
    const token = state.token;
    if (!githubOwner || !githubToken || !selectedRepo) return;
    if (!token) {
      alert('You must be logged in to create a project.');
      return;
    }
    setGithubLoading(true);
    setGithubError('');
    try {
      const issuesRes = await axios.get(
        `${API_URL}/github/${githubOwner}/${selectedRepo}/issues`,
        { headers: { Authorization: `Bearer ${githubToken}` } },
      );
      const issues = issuesRes.data;
      const taskGroup: TaskGroup = {
        name: selectedRepo,
        deadline: '',
        tasks: issues.map((issue: any) => ({
          description: issue.title,
          subtasks: [],
        })),
      };
      const projectData = {
        name: selectedRepo,
        description: `Imported from GitHub: ${githubOwner}/${selectedRepo}`,
        contributors: githubContributors,
        taskGroups: [taskGroup],
      };
      await addProject(dispatch, token, projectData);
      alert('Project created from GitHub successfully!');
      resetAll();
    } catch (err: any) {
      setGithubError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setGithubLoading(false);
    }
  };

  // ─── Reset ──────────────────────────────────────────────────────
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

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className='p-6'>
      {/* STEP 0: Choose type */}
      {step === 0 && (
        <div className='flex flex-col gap-4'>
          <h2 className='text-xl font-bold'>Choose project type</h2>

          <div className='flex flex-col gap-2'>
            <input
              type='text'
              placeholder='GitHub username'
              value={githubOwner}
              onChange={(e) => setGithubOwner(e.target.value)}
              className='p-2 border rounded'
            />
            <input
              type='password'
              placeholder='GitHub personal token'
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              className='p-2 border rounded'
            />
          </div>

          <button
            className='bg-blue-600 text-white p-2 rounded'
            onClick={() => {
              setProjectType('github');
              handleFetchRepos();
            }}
            disabled={githubLoading}
          >
            {githubLoading ? 'Loading repos...' : 'GitHub'}
          </button>

          <button
            className='bg-green-600 text-white p-2 rounded'
            onClick={() => {
              setProjectType('manual');
              setStep(1);
            }}
          >
            Manual
          </button>

          {githubError && <p className='text-red-500'>{githubError}</p>}
        </div>
      )}

      {/* GITHUB STEP 1: select repo */}
      {step === 1 && projectType === 'github' && (
        <div className='flex flex-col gap-4'>
          <h2 className='text-xl font-bold'>Select a Repository</h2>
          <ul className='flex flex-col gap-2'>
            {repos.map((repo) => (
              <li key={repo}>
                <button
                  className='w-full text-left bg-blue-100 hover:bg-blue-300 border border-blue-300 rounded p-2'
                  onClick={() => handleSelectRepo(repo)}
                >
                  {repo}
                </button>
              </li>
            ))}
          </ul>
          <button
            className='text-sm text-gray-500 underline'
            onClick={resetAll}
          >
            ← Back
          </button>
        </div>
      )}

      {/* GITHUB STEP 2: add contributors & import */}
      {step === 2 && projectType === 'github' && (
        <div className='flex flex-col gap-4'>
          <h2 className='text-xl font-bold'>Project: {selectedRepo}</h2>
          <p className='text-sm text-gray-600'>
            All issues will be imported as tasks.
          </p>

          <div className='flex flex-col gap-2'>
            <h3 className='font-semibold'>Contributors</h3>
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Add contributor username'
                value={newGithubContributor}
                onChange={(e) => setNewGithubContributor(e.target.value)}
                className='p-2 border rounded flex-1'
              />
              <button
                className='bg-blue-500 text-white p-2 rounded'
                onClick={handleAddGithubContributor}
              >
                Add
              </button>
            </div>
            <ul className='list-disc ml-5'>
              {githubContributors.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {githubError && <p className='text-red-500'>{githubError}</p>}

          <div className='flex gap-2'>
            <button
              className='text-sm text-gray-500 underline'
              onClick={() => setStep(1)}
            >
              ← Back
            </button>
            <button
              className='bg-blue-700 text-white p-2 rounded flex-1'
              onClick={handleSubmitGithub}
              disabled={githubLoading}
            >
              {githubLoading ? 'Creating...' : 'Create Project from GitHub'}
            </button>
          </div>
        </div>
      )}

      {/* MANUAL STEP 1: Project details */}
      {step === 1 && projectType === 'manual' && (
        <div className='flex flex-col gap-4'>
          <h2 className='text-xl font-bold'>Project Details</h2>
          <input
            type='text'
            placeholder='Project Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='p-2 border rounded'
          />
          <textarea
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='p-2 border rounded'
          />
          <div className='flex flex-col gap-2'>
            <h3 className='font-semibold'>Contributors</h3>
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Add Contributor'
                value={newContributor}
                onChange={(e) => setNewContributor(e.target.value)}
                className='p-2 border rounded'
              />
              <button
                className='bg-blue-500 text-white p-2 rounded'
                onClick={handleAddContributor}
              >
                Add
              </button>
            </div>
            <ul className='list-disc ml-5'>
              {contributors.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
          <button
            className='bg-green-600 text-white p-2 rounded'
            onClick={() => setStep(2)}
          >
            Next: Task Groups
          </button>
        </div>
      )}

      {/* MANUAL STEP 2: Task groups */}
      {step === 2 && projectType === 'manual' && (
        <div className='flex flex-col gap-4'>
          <h2 className='text-xl font-bold'>Task Groups</h2>
          <input
            type='text'
            placeholder='Task Group Name'
            value={newTaskGroup.name}
            onChange={(e) =>
              setNewTaskGroup({ ...newTaskGroup, name: e.target.value })
            }
            className='p-2 border rounded'
          />
          <input
            type='date'
            value={newTaskGroup.deadline}
            onChange={(e) =>
              setNewTaskGroup({ ...newTaskGroup, deadline: e.target.value })
            }
            className='p-2 border rounded'
          />
          <div className='flex flex-col gap-2 border p-2 rounded'>
            <h3 className='font-semibold'>Add Task</h3>
            <input
              type='text'
              placeholder='Task Description'
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className='p-2 border rounded'
            />
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Subtask'
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                className='p-2 border rounded'
              />
              <button
                className='bg-blue-500 text-white p-2 rounded'
                onClick={handleAddSubtask}
              >
                Add Subtask
              </button>
            </div>
            <button
              className='bg-green-500 text-white p-2 rounded'
              onClick={handleAddTask}
            >
              Add Task
            </button>
            <ul className='list-disc ml-5'>
              {newTaskGroup.tasks.map((t, i) => (
                <li key={i}>
                  {t.description}
                  <ul className='list-disc ml-5'>
                    {t.subtasks.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <button
            className='bg-green-600 text-white p-2 rounded'
            onClick={handleAddTaskGroup}
          >
            Add Task Group
          </button>
          <ul className='list-disc ml-5'>
            {taskGroups.map((tg, i) => (
              <li key={i}>
                {tg.name} (Deadline: {tg.deadline}) - Tasks: {tg.tasks.length}
              </li>
            ))}
          </ul>
          <button
            className='bg-blue-700 text-white p-2 rounded mt-4'
            onClick={handleSubmitManual}
          >
            Submit Project
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
