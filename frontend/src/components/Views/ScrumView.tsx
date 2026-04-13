import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import {
  fetchTasks,
  fetchSprints,
  createSprint,
  assignTaskToSprint,
  deleteSprint,
} from '../../Context/Actions';

type Task = {
  _id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Done';
  sprint?: string | null;
  deadline?: string;
  assignedTo?: { username: string } | null;
};

type Sprint = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
};

const COLUMNS: {
  key: Task['status'];
  label: string;
  accent: string;
  badge: string;
}[] = [
  {
    key: 'Open',
    label: 'To Do',
    accent: 'border-blue-400',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    key: 'InProgress',
    label: 'In Progress',
    accent: 'border-amber-400',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    key: 'Done',
    label: 'Done',
    accent: 'border-green-400',
    badge: 'bg-green-100 text-green-800',
  },
];

const getSprintId = (sprint: Task['sprint']): string | null => {
  if (!sprint) return null;
  if (typeof sprint === 'string') return sprint;
  return (sprint as any)._id ?? null;
};

const ScrumView = () => {
  const { state, dispatch } = useGlobalContext();
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const handleCreateSprint = async () => {
    if (!newSprint.name || !newSprint.startDate || !newSprint.endDate) return;
    if (!state.token || !state.selectedProject?._id) return;

    await createSprint(dispatch, state.token, {
      name: newSprint.name,
      projectId: state.selectedProject._id,
      startDate: newSprint.startDate,
      endDate: newSprint.endDate,
    });

    setNewSprint({ name: '', startDate: '', endDate: '' });
    setShowCreateForm(false);
  };

  const handleAssignTask = async (taskId: string) => {
    if (!selectedSprintId || !state.token) return;
    await assignTaskToSprint(dispatch, state.token, selectedSprintId, taskId);
    fetchTasks(dispatch, state.token, state.selectedProject._id);
  };

  const handleDeleteSprint = async (sprintId: string) => {
    if (!state.token) return;
    if (!confirm('Are you sure you want to delete this sprint?')) return;
    await deleteSprint(dispatch, state.token, sprintId);
    if (selectedSprintId === sprintId) {
      setSelectedSprintId('');
    }
  };

  const selectedSprint: Sprint | undefined = state.sprints?.find(
    (s: Sprint) => s._id === selectedSprintId,
  );

  const sprintTasks = state.tasks.filter(
    (t: Task) => getSprintId(t.sprint) === selectedSprintId,
  );

  const backlogTasks = state.tasks.filter((t: Task) => !t.sprint);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const isActive = (sprint: Sprint) => {
    const now = new Date();
    return new Date(sprint.startDate) <= now && now <= new Date(sprint.endDate);
  };

  return (
    <div className='p-4 h-full flex flex-col gap-4 overflow-auto'>
      {/* Header */}
      <div className='flex items-center justify-between flex-wrap gap-2'>
        <h2 className='text-2xl font-bold'>Scrum Board</h2>
        <div className='flex items-center gap-3'>
          {state.selectedProject && (
            <span className='text-sm text-gray-500'>
              {state.selectedProject.name}
            </span>
          )}
          {state.selectedProject && (
            <button
              className='text-sm bg-blue-700 text-white px-3 py-1.5 rounded-2xl hover:bg-blue-600 transition-colors'
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : '+ New Sprint'}
            </button>
          )}
        </div>
      </div>

      {!state.selectedProject && (
        <p className='text-sm text-gray-400'>
          Select a project in the top bar.
        </p>
      )}

      {/* Sprint create form */}
      {showCreateForm && (
        <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col gap-3'>
          <h3 className='text-sm font-semibold text-gray-700'>
            Create new sprint
          </h3>
          <input
            type='text'
            placeholder='Sprint name (e.g. Sprint 1)'
            value={newSprint.name}
            onChange={(e) =>
              setNewSprint({ ...newSprint, name: e.target.value })
            }
            className='p-2 border border-blue-200 rounded-xl text-sm'
          />
          <div className='flex gap-3'>
            <div className='flex flex-col gap-1 flex-1'>
              <label className='text-xs text-gray-500'>Start date</label>
              <input
                type='date'
                value={newSprint.startDate}
                onChange={(e) =>
                  setNewSprint({ ...newSprint, startDate: e.target.value })
                }
                className='p-2 border border-blue-200 rounded-xl text-sm'
              />
            </div>
            <div className='flex flex-col gap-1 flex-1'>
              <label className='text-xs text-gray-500'>End date</label>
              <input
                type='date'
                value={newSprint.endDate}
                onChange={(e) =>
                  setNewSprint({ ...newSprint, endDate: e.target.value })
                }
                className='p-2 border border-blue-200 rounded-xl text-sm'
              />
            </div>
          </div>
          <button
            onClick={handleCreateSprint}
            disabled={
              !newSprint.name || !newSprint.startDate || !newSprint.endDate
            }
            className='bg-blue-700 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-600 disabled:opacity-40 transition-colors'
          >
            Create Sprint
          </button>
        </div>
      )}

      {state.loading && <p className='text-sm text-gray-400'>Loading...</p>}

      {/* Sprint selector */}
      {state.sprints.map((sprint: Sprint) => (
        <div key={sprint._id} className='flex items-center gap-1'>
          <button
            onClick={() => setSelectedSprintId(sprint._id)}
            className={`px-4 py-1.5 rounded-2xl text-sm font-medium border transition-colors ${
              selectedSprintId === sprint._id
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-600 border-blue-200 hover:border-blue-400'
            }`}
          >
            {sprint.name}
            {isActive(sprint) && (
              <span className='ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full'>
                active
              </span>
            )}
          </button>
          <button
            onClick={() => handleDeleteSprint(sprint._id)}
            className='text-xs text-red-400 border border-red-200 px-2 py-1.5 rounded-2xl hover:bg-red-50 transition-colors'
          >
            ✕
          </button>
        </div>
      ))}

      {/* No sprints */}
      {state.sprints?.length === 0 &&
        state.selectedProject &&
        !state.loading && (
          <p className='text-sm text-gray-400'>
            No sprints found for this project.
          </p>
        )}

      {/* Sprint info bar */}
      {selectedSprint && (
        <div className='bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 flex gap-6 text-sm text-gray-600 flex-wrap'>
          <span>
            <span className='font-medium text-gray-800'>Start:</span>{' '}
            {formatDate(selectedSprint.startDate)}
          </span>
          <span>
            <span className='font-medium text-gray-800'>End:</span>{' '}
            {formatDate(selectedSprint.endDate)}
          </span>
          <span>
            <span className='font-medium text-gray-800'>Tasks:</span>{' '}
            {sprintTasks.length}
          </span>
          <span>
            <span className='font-medium text-gray-800'>Done:</span>{' '}
            {sprintTasks.filter((t: Task) => t.status === 'Done').length} /{' '}
            {sprintTasks.length}
          </span>
        </div>
      )}

      {/* Kanban columns */}
      {selectedSprint && (
        <div className='flex gap-4 overflow-x-auto pb-2 items-start'>
          {COLUMNS.map((col) => {
            const tasks = sprintTasks.filter((t: Task) => t.status === col.key);
            return (
              <div key={col.key} className='flex-none w-60 flex flex-col gap-2'>
                <div
                  className={`bg-blue-50 border-t-2 ${col.accent} rounded-2xl p-3 flex flex-col gap-2`}
                >
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                      {col.label}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${col.badge}`}
                    >
                      {tasks.length}
                    </span>
                  </div>

                  {tasks.length === 0 && (
                    <p className='text-xs text-gray-400 text-center py-4'>
                      No tasks
                    </p>
                  )}

                  {tasks.map((task: Task) => (
                    <div
                      key={task._id}
                      className='bg-white border border-blue-100 rounded-xl p-3 hover:border-blue-300 transition-colors'
                    >
                      <p className='text-sm font-medium text-gray-800'>
                        {task.title}
                      </p>
                      {task.assignedTo && (
                        <p className='text-xs text-gray-400 mt-0.5'>
                          👤 {task.assignedTo.username}
                        </p>
                      )}
                      {task.deadline && (
                        <p className='text-xs text-gray-300 mt-1'>
                          {formatDate(task.deadline)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Backlog */}
      {backlogTasks.length > 0 && (
        <div className='mt-2'>
          <h3 className='text-base font-semibold text-gray-600 mb-2'>
            Backlog ({backlogTasks.length})
          </h3>
          <div className='flex flex-col gap-2'>
            {backlogTasks.map((task: Task) => (
              <div
                key={task._id}
                className='bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between hover:border-blue-200 transition-colors'
              >
                <p className='text-sm font-medium text-gray-700'>
                  {task.title}
                </p>
                {selectedSprintId && (
                  <button
                    onClick={() => handleAssignTask(task._id)}
                    className='text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded-xl hover:bg-blue-50 transition-colors'
                  >
                    + Add to Sprint
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrumView;
