import { useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { addProject } from '../../Context/Actions';

interface TaskGroup {
  name: string;
  deadline: string;
  tasks: Task[];
}

interface Task {
  description: string;
  subtasks: string[];
}

const CreateProject = () => {
  const { state, dispatch } = useGlobalContext();

  const [step, setStep] = useState(0); // lépések száma
  const [projectType, setProjectType] = useState<'github' | 'manual' | ''>('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [admin, setAdmin] = useState('');
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

  const handleSubmitProject = async () => {
    const projectData = {
      name,
      description,
      admin,
      contributors,
      taskGroups,
    };
    console.log(projectData);

    if (state.token) {
      await addProject(dispatch, state.token, projectData);
      alert('Project created successfully!');
      // Reset everything
      setStep(0);
      setProjectType('');
      setName('');
      setDescription('');
      setAdmin('');
      setContributors([]);
      setTaskGroups([]);
    }
  };

  return (
    <div className='p-6'>
      {step === 0 && (
        <div className='flex flex-col gap-4'>
          <h2 className='text-xl font-bold'>Choose project type</h2>
          <button
            className='bg-blue-600 text-white p-2 rounded'
            onClick={() => {
              setProjectType('github');
              setStep(1);
            }}
          >
            GitHub
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
        </div>
      )}

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
          <input
            type='text'
            placeholder='Admin Name'
            value={admin}
            onChange={(e) => setAdmin(e.target.value)}
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

      {step === 2 && (
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
            placeholder='Deadline'
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

          <h3 className='font-semibold'>Current Task Groups:</h3>
          <ul className='list-disc ml-5'>
            {taskGroups.map((tg, i) => (
              <li key={i}>
                {tg.name} (Deadline: {tg.deadline}) - Tasks: {tg.tasks.length}
              </li>
            ))}
          </ul>

          <button
            className='bg-blue-700 text-white p-2 rounded mt-4'
            onClick={handleSubmitProject}
          >
            Submit Project
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
