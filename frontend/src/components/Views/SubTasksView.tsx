import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { fetchSubtasks, addSubtask } from '../../Context/Actions';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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

const statusBadge = (status: Subtask['status']) => {
  const map = {
    Open: 'bg-blue-100 text-blue-800',
    InProgress: 'bg-amber-100 text-amber-800',
    Done: 'bg-green-100 text-green-800',
  };
  return map[status];
};

const SubTasksView = () => {
  const { state, dispatch } = useGlobalContext();

  const [addingForTask, setAddingForTask] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [editingSub, setEditingSub] = useState<Subtask | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    status: 'Open' as Subtask['status'],
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (state.token && state.tasks.length > 0) {
      state.tasks.forEach((task: Task) => {
        fetchSubtasks(dispatch, state.token!, task._id);
      });
    }
  }, [state.tasks]);

  const handleAddSubtask = async (taskId: string) => {
    if (!newSubtaskTitle.trim() || !state.token) return;
    await addSubtask(dispatch, state.token, {
      title: newSubtaskTitle.trim(),
      task: taskId,
    });
    setNewSubtaskTitle('');
    setAddingForTask(null);
  };

  const handleEditOpen = (sub: Subtask) => {
    setEditingSub(sub);
    setEditData({ title: sub.title, status: sub.status });
  };

  const handleEditSave = async () => {
    if (!editingSub || !state.token) return;
    setLoadingId(editingSub._id);
    try {
      const res = await axios.put(
        `${API_URL}/subtasks/${editingSub._id}`,
        { title: editData.title.trim(), status: editData.status },
        { headers: { Authorization: `Bearer ${state.token}` } },
      );
      dispatch({ type: 'UPDATE_SUBTASK', payload: res.data });
      setEditingSub(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (subId: string) => {
    if (!state.token) return;
    if (!confirm('Are you sure you want to delete this subtask?')) return;
    setLoadingId(subId);
    try {
      await axios.delete(`${API_URL}/subtasks/${subId}`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      dispatch({ type: 'DELETE_SUBTASK', payload: subId });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  if (!state.selectedProject) {
    return (
      <div className='p-6'>
        <h2 className='text-2xl font-bold mb-2'>Subtasks</h2>
        <p className='text-sm text-gray-400'>
          Select a project in the top bar.
        </p>
      </div>
    );
  }

  return (
    <div className='p-6 flex flex-col gap-4 overflow-auto'>
      <h2 className='text-2xl font-bold'>Subtasks</h2>

      {state.loading && <p className='text-sm text-gray-400'>Loading...</p>}

      {state.tasks.length === 0 && !state.loading && (
        <p className='text-sm text-gray-400'>No tasks in this project.</p>
      )}

      {/* Group subtasks by task */}
      {state.tasks.map((task: Task) => {
        const subs: Subtask[] = state.subtasks.filter(
          (s: Subtask) =>
            (typeof s.task === 'string' ? s.task : (s.task as any)?._id) ===
            task._id,
        );

        return (
          <div
            key={task._id}
            className='bg-white border border-blue-200 rounded-2xl p-4'
          >
            {/* Task header */}
            <div className='flex items-center gap-2 mb-3'>
              <span className='font-semibold text-gray-800'>{task.title}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(task.status)}`}
              >
                {task.status}
              </span>
            </div>

            {/* Subtask list */}
            <div className='flex flex-col gap-2'>
              {subs.length === 0 && (
                <p className='text-xs text-gray-400'>No subtasks.</p>
              )}

              {subs.map((sub: Subtask) => (
                <div
                  key={sub._id}
                  className='bg-blue-50 border border-blue-100 rounded-xl px-3 py-2'
                >
                  {editingSub?._id === sub._id ? (
                    /* ── Edit mode ── */
                    <div className='flex flex-col gap-2'>
                      <input
                        type='text'
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                        className='p-1.5 border border-blue-200 rounded-lg text-sm'
                        autoFocus
                      />
                      <select
                        value={editData.status}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            status: e.target.value as Subtask['status'],
                          })
                        }
                        className='p-1.5 border border-blue-200 rounded-lg text-sm bg-white'
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <div className='flex gap-2'>
                        <button
                          onClick={handleEditSave}
                          disabled={loadingId === sub._id}
                          className='bg-blue-700 text-white text-xs px-3 py-1 rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-colors'
                        >
                          {loadingId === sub._id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingSub(null)}
                          className='text-xs text-gray-500 px-2 py-1 border border-gray-200 rounded-lg hover:bg-gray-50'
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── View mode ── */
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex items-center gap-2 flex-1 min-w-0'>
                        <span className='text-sm text-gray-700 truncate'>
                          {sub.title}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusBadge(sub.status)}`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <div className='flex gap-1.5 shrink-0'>
                        <button
                          onClick={() => handleEditOpen(sub)}
                          className='text-xs border border-blue-200 text-blue-700 px-2 py-0.5 rounded-lg hover:bg-blue-100 transition-colors'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sub._id)}
                          disabled={loadingId === sub._id}
                          className='text-xs border border-red-200 text-red-600 px-2 py-0.5 rounded-lg hover:bg-red-50 disabled:opacity-40 transition-colors'
                        >
                          {loadingId === sub._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add subtask inline */}
            <div className='mt-3 border-t border-blue-100 pt-3'>
              {addingForTask === task._id ? (
                <div className='flex gap-2'>
                  <input
                    type='text'
                    placeholder='Subtask title'
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && handleAddSubtask(task._id)
                    }
                    className='flex-1 p-1.5 border border-blue-200 rounded-lg text-sm'
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddSubtask(task._id)}
                    disabled={!newSubtaskTitle.trim()}
                    className='bg-blue-700 text-white text-xs px-3 py-1 rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-colors'
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setAddingForTask(null);
                      setNewSubtaskTitle('');
                    }}
                    className='text-xs text-gray-400 px-2 py-1 hover:text-gray-600'
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingForTask(task._id);
                    setNewSubtaskTitle('');
                  }}
                  className='text-xs text-blue-600 hover:text-blue-800 transition-colors'
                >
                  + Add subtask
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubTasksView;
