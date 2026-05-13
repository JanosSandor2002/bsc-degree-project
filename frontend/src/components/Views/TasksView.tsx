import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { fetchTasks, addTask } from '../../Context/Actions';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

type Task = {
  _id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Done';
  deadline?: string;
  assignedTo?: { username: string } | null;
};

const STATUS_OPTIONS: Task['status'][] = ['Open', 'InProgress', 'Done'];

const statusBadge = (status: Task['status']) =>
  ({
    Open: 'bg-blue-100 text-blue-800',
    InProgress: 'bg-amber-100 text-amber-800',
    Done: 'bg-green-100 text-green-800',
  })[status];

const TasksView = () => {
  const { state, dispatch } = useGlobalContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    status: 'Open' as Task['status'],
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    deadline: '',
    status: 'Open' as Task['status'],
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [xpToast, setXpToast] = useState<string | null>(null);

  useEffect(() => {
    if (state.token && state.selectedProject?._id) {
      fetchTasks(dispatch, state.token, state.selectedProject._id);
    }
  }, [state.selectedProject?._id]);

  const showToast = (msg: string) => {
    setXpToast(msg);
    setTimeout(() => setXpToast(null), 3000);
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
    setShowAddForm(false);
  };

  const handleEditOpen = (task: Task) => {
    setEditingTask(task);
    setEditData({
      title: task.title,
      deadline: task.deadline ? task.deadline.slice(0, 10) : '',
      status: task.status,
    });
  };

  const handleEditSave = async () => {
    if (!editingTask || !state.token) return;
    setLoadingId(editingTask._id);
    const becomingDone =
      editData.status === 'Done' && editingTask.status !== 'Done';
    try {
      let res;
      if (becomingDone) {
        res = await axios.put(
          `${API_URL}/tasks/${editingTask._id}/complete`,
          {
            title: editData.title.trim(),
            ...(editData.deadline ? { deadline: editData.deadline } : {}),
          },
          { headers: { Authorization: `Bearer ${state.token}` } },
        );
        showToast('✦ Task completed! +5 XP awarded');
      } else {
        res = await axios.put(
          `${API_URL}/tasks/${editingTask._id}`,
          {
            title: editData.title.trim(),
            status: editData.status,
            ...(editData.deadline ? { deadline: editData.deadline } : {}),
          },
          { headers: { Authorization: `Bearer ${state.token}` } },
        );
      }
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!state.token || !confirm('Are you sure you want to delete this task?'))
      return;
    setLoadingId(taskId);
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const done = state.tasks.filter((t: Task) => t.status === 'Done').length;
  const total = state.tasks.length;

  return (
    <div className='h-full overflow-auto'>
      {xpToast && (
        <div className='fixed top-6 right-6 z-50 bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg'>
          {xpToast}
        </div>
      )}

      {/*Hero  */}
      <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden'>
        <div className='absolute -top-6 -right-6 w-44 h-44 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10 flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-2 tracking-wide'>
              Tasks
            </div>
            <h1 className='text-2xl font-bold text-white'>
              {state.selectedProject
                ? state.selectedProject.name
                : 'Select a project'}
            </h1>
            {state.selectedProject && total > 0 && (
              <p className='text-blue-300 text-xs mt-1'>
                {done} of {total} tasks completed
              </p>
            )}
          </div>
          {state.selectedProject && (
            <button
              className='shrink-0 bg-white text-blue-900 font-semibold text-xs px-4 py-2 rounded-2xl hover:bg-blue-50 transition-colors'
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : '+ New task'}
            </button>
          )}
        </div>
      </div>

      <div className='px-6 py-5 flex flex-col gap-3'>
        {!state.selectedProject && (
          <p className='text-sm text-gray-400'>
            Select a project in the top bar.
          </p>
        )}

        {/* Add form */}
        {showAddForm && (
          <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col gap-3'>
            <p className='text-sm font-semibold text-gray-700'>New task</p>
            <input
              type='text'
              placeholder='Task title'
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className='p-2 border border-blue-200 rounded-xl text-sm'
              autoFocus
            />
            <div className='flex gap-3'>
              <div className='flex flex-col gap-1 flex-1'>
                <label className='text-xs text-gray-500'>
                  Deadline (optional)
                </label>
                <input
                  type='date'
                  value={newTask.deadline}
                  onChange={(e) =>
                    setNewTask({ ...newTask, deadline: e.target.value })
                  }
                  className='p-2 border border-blue-200 rounded-xl text-sm'
                />
              </div>
              <div className='flex flex-col gap-1 flex-1'>
                <label className='text-xs text-gray-500'>Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      status: e.target.value as Task['status'],
                    })
                  }
                  className='p-2 border border-blue-200 rounded-xl text-sm bg-white'
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleAdd}
              disabled={!newTask.title.trim()}
              className='bg-blue-700 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-600 disabled:opacity-40 transition-colors'
            >
              Add task
            </button>
          </div>
        )}

        {state.loading && <p className='text-sm text-gray-400'>Loading...</p>}

        {/* Task list */}
        {state.tasks.map((task: Task) => (
          <div
            key={task._id}
            className='bg-white border border-blue-200 rounded-2xl p-4 hover:border-blue-300 hover:shadow-sm transition-all'
          >
            {editingTask?._id === task._id ? (
              <div className='flex flex-col gap-3'>
                <input
                  type='text'
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  className='p-2 border border-blue-300 rounded-xl text-sm'
                  autoFocus
                />
                <div className='flex gap-3'>
                  <div className='flex flex-col gap-1 flex-1'>
                    <label className='text-xs text-gray-500'>Deadline</label>
                    <input
                      type='date'
                      value={editData.deadline}
                      onChange={(e) =>
                        setEditData({ ...editData, deadline: e.target.value })
                      }
                      className='p-2 border border-blue-200 rounded-xl text-sm'
                    />
                  </div>
                  <div className='flex flex-col gap-1 flex-1'>
                    <label className='text-xs text-gray-500'>Status</label>
                    <select
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value as Task['status'],
                        })
                      }
                      className='p-2 border border-blue-200 rounded-xl text-sm bg-white'
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {editData.status === 'Done' &&
                  editingTask?.status !== 'Done' && (
                    <p className='text-xs text-green-600 font-medium'>
                      ✦ Completing this task will award +5 XP
                    </p>
                  )}
                <div className='flex gap-2'>
                  <button
                    onClick={handleEditSave}
                    disabled={loadingId === task._id}
                    className='bg-blue-700 text-white text-sm px-4 py-1.5 rounded-xl hover:bg-blue-600 disabled:opacity-40 transition-colors'
                  >
                    {loadingId === task._id ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className='text-sm text-gray-500 px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p className='font-semibold text-gray-800'>{task.title}</p>
                  <div className='flex items-center gap-2 mt-1.5 flex-wrap'>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge(task.status)}`}
                    >
                      {task.status}
                    </span>
                    {task.assignedTo && (
                      <span className='flex items-center gap-1 text-xs text-gray-400'>
                        <span className='w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold'>
                          {task.assignedTo.username[0].toUpperCase()}
                        </span>
                        {task.assignedTo.username}
                      </span>
                    )}
                    {task.deadline && (
                      <span className='text-xs text-gray-400'>
                        {new Date(task.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <div className='flex gap-2 shrink-0'>
                  <button
                    onClick={() => handleEditOpen(task)}
                    className='text-xs border border-blue-200 text-blue-700 px-2.5 py-1 rounded-xl hover:bg-blue-50 transition-colors'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    disabled={loadingId === task._id}
                    className='text-xs border border-red-200 text-red-600 px-2.5 py-1 rounded-xl hover:bg-red-50 disabled:opacity-40 transition-colors'
                  >
                    {loadingId === task._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {!state.loading &&
          state.selectedProject &&
          state.tasks.length === 0 && (
            <div className='flex flex-col items-center py-12 gap-2'>
              <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 text-lg'>
                ◎
              </div>
              <p className='text-sm text-gray-400'>
                No tasks yet. Add your first task above.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default TasksView;
