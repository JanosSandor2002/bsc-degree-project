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

const statusBadge = (status: Task['status']) => {
  const map = {
    Open: 'bg-blue-100 text-blue-800',
    InProgress: 'bg-amber-100 text-amber-800',
    Done: 'bg-green-100 text-green-800',
  };
  return map[status];
};

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

  useEffect(() => {
    if (state.token && state.selectedProject?._id) {
      fetchTasks(dispatch, state.token, state.selectedProject._id);
    }
  }, [state.selectedProject?._id]);

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
    try {
      const res = await axios.put(
        `${API_URL}/tasks/${editingTask._id}`,
        {
          title: editData.title.trim(),
          status: editData.status,
          ...(editData.deadline ? { deadline: editData.deadline } : {}),
        },
        { headers: { Authorization: `Bearer ${state.token}` } },
      );
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!state.token) return;
    if (!confirm('Are you sure you want to delete this Task?')) return;
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

  return (
    <div className='p-6 flex flex-col gap-3'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Tasks</h2>
        {state.selectedProject && (
          <button
            className='text-sm bg-blue-700 text-white px-3 py-1.5 rounded-2xl hover:bg-blue-600 transition-colors'
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Back' : '+ New task'}
          </button>
        )}
      </div>

      {!state.selectedProject && (
        <p className='text-sm text-gray-400'>
          Select a project in the top bar.
        </p>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className='bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col gap-3'>
          <h3 className='text-sm font-semibold text-gray-700'>New task</h3>
          <input
            type='text'
            placeholder='Task megnevezése'
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className='p-2 border border-blue-200 rounded-xl text-sm'
            autoFocus
          />
          <div className='flex gap-3'>
            <div className='flex flex-col gap-1 flex-1'>
              <label className='text-xs text-gray-500'>Date (optional)</label>
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
            Add
          </button>
        </div>
      )}

      {state.loading && <p className='text-sm text-gray-400'>Loading...</p>}

      {/* Task list */}
      {state.tasks.map((task: Task) => (
        <div
          key={task._id}
          className='bg-white border border-blue-200 rounded-2xl p-4'
        >
          {editingTask?._id === task._id ? (
            /* ── Edit mode ── */
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
              <div className='flex gap-2'>
                <button
                  onClick={handleEditSave}
                  disabled={loadingId === task._id}
                  className='bg-blue-700 text-white text-sm px-4 py-1.5 rounded-xl hover:bg-blue-600 disabled:opacity-40 transition-colors'
                >
                  {loadingId === task._id ? 'Saving...' : 'Saving'}
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className='text-sm text-gray-500 px-3 py-1.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors'
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            /* ── View mode ── */
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='font-semibold text-gray-800'>{task.title}</p>
                <div className='flex items-center gap-2 mt-1 flex-wrap'>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge(task.status)}`}
                  >
                    {task.status}
                  </span>
                  {task.assignedTo && (
                    <span className='text-xs text-gray-400'>
                      👤 {task.assignedTo.username}
                    </span>
                  )}
                  {task.deadline && (
                    <span className='text-xs text-gray-400'>
                      {new Date(task.deadline).toLocaleDateString('hu-HU')}
                    </span>
                  )}
                </div>
              </div>
              <div className='flex gap-2 shrink-0'>
                <button
                  onClick={() => handleEditOpen(task)}
                  className='text-xs border border-blue-200 text-blue-700 px-2.5 py-1 rounded-xl hover:bg-blue-50 transition-colors'
                >
                  Modify
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

      {!state.loading && state.selectedProject && state.tasks.length === 0 && (
        <p className='text-sm text-gray-400 text-center py-6'>
          There is no task in this project yet.
        </p>
      )}
    </div>
  );
};

export default TasksView;
