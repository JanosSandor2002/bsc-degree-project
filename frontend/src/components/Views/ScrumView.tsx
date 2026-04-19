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
  badgeCls: string;
  dotCls: string;
}[] = [
  {
    key: 'Open',
    label: 'To Do',
    accent: 'border-blue-400',
    badgeCls: 'bg-blue-100 text-blue-800',
    dotCls: 'bg-blue-400',
  },
  {
    key: 'InProgress',
    label: 'In Progress',
    accent: 'border-amber-400',
    badgeCls: 'bg-amber-100 text-amber-800',
    dotCls: 'bg-amber-400',
  },
  {
    key: 'Done',
    label: 'Done',
    accent: 'border-green-400',
    badgeCls: 'bg-green-100 text-green-800',
    dotCls: 'bg-green-400',
  },
];

const getSprintId = (sprint: Task['sprint']): string | null => {
  if (!sprint) return null;
  if (typeof sprint === 'string') return sprint;
  return (sprint as any)._id ?? null;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const isActive = (sprint: Sprint) => {
  const now = new Date();
  return new Date(sprint.startDate) <= now && now <= new Date(sprint.endDate);
};

const ScrumView = () => {
  const { state, dispatch } = useGlobalContext();
  const [selectedSprintId, setSelectedSprintId] = useState('');
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
    if (!confirm('Delete this sprint? Tasks will return to the backlog.'))
      return;
    await deleteSprint(dispatch, state.token, sprintId);
    if (selectedSprintId === sprintId) setSelectedSprintId('');
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
    <div className='h-full flex flex-col overflow-hidden'>
      {/* ── Hero header ── */}
      <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden shrink-0'>
        <div className='absolute -top-6 -right-6 w-44 h-44 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10 flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-2 tracking-wide'>
              Scrum Board
            </div>
            <h1 className='text-2xl font-bold text-white'>
              {state.selectedProject
                ? state.selectedProject.name
                : 'Select a project'}
            </h1>
            {selectedSprint && (
              <p className='text-blue-300 text-xs mt-1'>
                {selectedSprint.name} · {formatDate(selectedSprint.startDate)} →{' '}
                {formatDate(selectedSprint.endDate)}
              </p>
            )}
          </div>
          {state.selectedProject && (
            <button
              className='shrink-0 bg-white text-blue-900 font-semibold text-xs px-4 py-2 rounded-2xl hover:bg-blue-50 transition-colors'
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : '+ New Sprint'}
            </button>
          )}
        </div>
      </div>

      <div className='flex-1 overflow-auto px-6 py-5 flex flex-col gap-4'>
        {/* ── Create sprint form ── */}
        {showCreateForm && (
          <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col gap-3'>
            <p className='text-sm font-semibold text-gray-700'>New sprint</p>
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

        {!state.selectedProject && (
          <p className='text-sm text-gray-400'>
            Select a project from the top bar.
          </p>
        )}
        {state.loading && <p className='text-sm text-gray-400'>Loading...</p>}

        {/* ── Sprint selector tabs ── */}
        {state.sprints?.length > 0 && (
          <div className='flex gap-2 flex-wrap'>
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
                  className='text-xs text-red-400 border border-red-200 w-7 h-7 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center'
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {state.sprints?.length === 0 &&
          state.selectedProject &&
          !state.loading && (
            <p className='text-sm text-gray-400'>
              No sprints yet. Create your first sprint above.
            </p>
          )}

        {/* ── Sprint info bar ── */}
        {selectedSprint && (
          <div className='bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 flex gap-6 text-sm flex-wrap'>
            <span className='text-gray-500'>
              Start:{' '}
              <span className='font-medium text-gray-700'>
                {formatDate(selectedSprint.startDate)}
              </span>
            </span>
            <span className='text-gray-500'>
              End:{' '}
              <span className='font-medium text-gray-700'>
                {formatDate(selectedSprint.endDate)}
              </span>
            </span>
            <span className='text-gray-500'>
              Tasks:{' '}
              <span className='font-medium text-gray-700'>
                {sprintTasks.length}
              </span>
            </span>
            <span className='text-gray-500'>
              Done:{' '}
              <span className='font-medium text-green-600'>{doneCount}</span> /{' '}
              {sprintTasks.length}
            </span>
            {sprintTasks.length > 0 && (
              <span className='text-gray-500'>
                Progress:{' '}
                <span className='font-medium text-blue-600'>
                  {Math.round((doneCount / sprintTasks.length) * 100)}%
                </span>
              </span>
            )}
          </div>
        )}

        {/* ── Kanban columns ── */}
        {selectedSprint && (
          <div className='flex gap-4 overflow-x-auto pb-2 items-start'>
            {COLUMNS.map((col) => {
              const tasks = sprintTasks.filter(
                (t: Task) => t.status === col.key,
              );
              return (
                <div
                  key={col.key}
                  className='flex-none w-60 flex flex-col gap-2'
                >
                  <div className='flex items-center justify-between mb-1'>
                    <div className='flex items-center gap-2'>
                      <span className={`w-2 h-2 rounded-full ${col.dotCls}`} />
                      <span className='text-xs font-semibold text-gray-600 uppercase tracking-wide'>
                        {col.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${col.badgeCls}`}
                    >
                      {tasks.length}
                    </span>
                  </div>
                  <div
                    className={`bg-white border border-blue-100 border-t-2 ${col.accent} rounded-2xl p-3 flex flex-col gap-2 min-h-32`}
                  >
                    {tasks.length === 0 && (
                      <p className='text-xs text-gray-300 text-center py-4'>
                        No tasks
                      </p>
                    )}
                    {tasks.map((task: Task) => (
                      <div
                        key={task._id}
                        className='bg-white border border-blue-100 rounded-xl p-3 hover:border-blue-300 hover:shadow-sm transition-all'
                      >
                        <p className='text-sm font-medium text-gray-800'>
                          {task.title}
                        </p>
                        {task.assignedTo && (
                          <div className='flex items-center gap-1 mt-1.5'>
                            <span className='w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold'>
                              {task.assignedTo.username[0].toUpperCase()}
                            </span>
                            <span className='text-xs text-gray-400'>
                              {task.assignedTo.username}
                            </span>
                          </div>
                        )}
                        {task.deadline && (
                          <p className='text-xs text-gray-300 mt-1'>
                            {new Date(task.deadline).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' },
                            )}
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

        {/* ── Backlog ── */}
        {backlogTasks.length > 0 && (
          <div>
            <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2'>
              Backlog ({backlogTasks.length})
            </p>
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
                      className='text-xs text-blue-600 border border-blue-200 px-2.5 py-1 rounded-xl hover:bg-blue-50 transition-colors shrink-0 ml-3'
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
    </div>
  );
};

export default ScrumView;
