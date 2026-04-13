import { useEffect } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { fetchTasks } from '../../Context/Actions';

type Task = {
  _id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Done';
  deadline?: string;
  assignedTo?: { username: string } | null;
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

const KanbanView = () => {
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    if (state.token && state.selectedProject?._id) {
      fetchTasks(dispatch, state.token, state.selectedProject._id);
    }
  }, [state.selectedProject?._id]);

  return (
    <div className='p-4 h-full flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Kanban Table</h2>
        {state.selectedProject && (
          <span className='text-sm text-gray-500'>
            {state.selectedProject.name}
          </span>
        )}
      </div>

      {!state.selectedProject && (
        <p className='text-gray-400 text-sm'>
          Válassz projektet a felső sávban.
        </p>
      )}

      {state.loading && <p className='text-sm text-gray-400'>Betöltés...</p>}

      <div className='flex gap-4 overflow-x-auto pb-2 items-start flex-1'>
        {COLUMNS.map((col) => {
          const tasks = state.tasks.filter((t: Task) => t.status === col.key);
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
                    Nincs feladat
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
                        {new Date(task.deadline).toLocaleDateString('hu-HU')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanView;
