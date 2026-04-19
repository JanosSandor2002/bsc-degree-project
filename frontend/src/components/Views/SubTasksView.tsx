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

const statusBadge = (status: Subtask['status']) =>
  ({
    Open: 'bg-blue-100 text-blue-800',
    InProgress: 'bg-amber-100 text-amber-800',
    Done: 'bg-green-100 text-green-800',
  })[status];

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
  const [xpToast, setXpToast] = useState<string | null>(null);

  useEffect(() => {
    if (state.token && state.tasks.length > 0) {
      state.tasks.forEach((task: Task) =>
        fetchSubtasks(dispatch, state.token!, task._id),
      );
    }
  }, [state.tasks]);

  const showToast = (msg: string) => {
    setXpToast(msg);
    setTimeout(() => setXpToast(null), 3000);
  };

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
    const becomingDone =
      editData.status === 'Done' && editingSub.status !== 'Done';
    try {
      let res;
      if (becomingDone) {
        res = await axios.put(
          `${API_URL}/subtasks/${editingSub._id}/complete`,
          { title: editData.title.trim() },
          { headers: { Authorization: `Bearer ${state.token}` } },
        );
        showToast('✦ Subtask completed! +3 XP awarded');
      } else {
        res = await axios.put(
          `${API_URL}/subtasks/${editingSub._id}`,
          { title: editData.title.trim(), status: editData.status },
          { headers: { Authorization: `Bearer ${state.token}` } },
        );
      }
      dispatch({ type: 'UPDATE_SUBTASK', payload: res.data });
      setEditingSub(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (subId: string) => {
    if (
      !state.token ||
      !confirm('Are you sure you want to delete this subtask?')
    )
      return;
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

  const totalSubs = state.subtasks.length;
  const doneSubs = state.subtasks.filter(
    (s: Subtask) => s.status === 'Done',
  ).length;

  if (!state.selectedProject) {
    return (
      <div className='h-full flex flex-col'>
        <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl'>
          <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-2'>
            Subtasks
          </div>
          <h1 className='text-2xl font-bold text-white'>Subtasks</h1>
        </div>
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-sm text-gray-400'>
            Select a project in the top bar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full overflow-auto'>
      {xpToast && (
        <div className='fixed top-6 right-6 z-50 bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg'>
          {xpToast}
        </div>
      )}

      {/* ── Hero ── */}
      <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden'>
        <div className='absolute -top-6 -right-6 w-44 h-44 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10'>
          <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-2 tracking-wide'>
            Subtasks
          </div>
          <h1 className='text-2xl font-bold text-white'>
            {state.selectedProject.name}
          </h1>
          {totalSubs > 0 && (
            <p className='text-blue-300 text-xs mt-1'>
              {doneSubs} of {totalSubs} subtasks completed
            </p>
          )}
        </div>
      </div>

      <div className='px-6 py-5 flex flex-col gap-4'>
        {state.loading && <p className='text-sm text-gray-400'>Loading...</p>}
        {state.tasks.length === 0 && !state.loading && (
          <p className='text-sm text-gray-400'>No tasks in this project.</p>
        )}

        {state.tasks.map((task: Task) => {
          const subs: Subtask[] = state.subtasks.filter(
            (s: Subtask) =>
              (typeof s.task === 'string' ? s.task : (s.task as any)?._id) ===
              task._id,
          );
          return (
            <div
              key={task._id}
              className='bg-white border border-blue-200 rounded-2xl p-4 hover:border-blue-300 transition-all'
            >
              {/* Task header */}
              <div className='flex items-center gap-2 mb-3'>
                <span className='font-semibold text-gray-800'>
                  {task.title}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(task.status)}`}
                >
                  {task.status}
                </span>
                <span className='text-xs text-gray-300 ml-auto'>
                  {subs.length} subtask{subs.length !== 1 ? 's' : ''}
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
                        {editData.status === 'Done' &&
                          editingSub?.status !== 'Done' && (
                            <p className='text-xs text-green-600 font-medium'>
                              ✦ Completing this subtask will award +3 XP
                            </p>
                          )}
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

              {/* Add subtask */}
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
    </div>
  );
};

export default SubTasksView;
