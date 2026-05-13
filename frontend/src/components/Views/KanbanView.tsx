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

const KanbanView = () => {
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    if (state.token && state.selectedProject?._id) {
      fetchTasks(dispatch, state.token, state.selectedProject._id);
    }
  }, [state.selectedProject?._id]);

  const totalTasks = state.tasks.length;
  const doneTasks = state.tasks.filter((t: Task) => t.status === 'Done').length;

  return (
    <div className='h-full flex flex-col overflow-hidden'>
      {/*Hero*/}
      <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden shrink-0'>
        <div className='absolute -top-6 -right-6 w-44 h-44 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10 flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-2 tracking-wide'>
              Kanban Board
            </div>
            <h1 className='text-2xl font-bold text-white leading-tight'>
              {state.selectedProject
                ? state.selectedProject.name
                : 'Select a project'}
            </h1>
            {state.selectedProject && (
              <p className='text-blue-300 text-xs mt-1'>
                {doneTasks} of {totalTasks} tasks completed
              </p>
            )}
          </div>

          {/* Mini progress */}
          {state.selectedProject && totalTasks > 0 && (
            <div className='bg-blue-800 bg-opacity-60 border border-blue-600 border-opacity-40 rounded-2xl px-4 py-2 text-center shrink-0'>
              <p className='text-white font-bold text-xl leading-none'>
                {Math.round((doneTasks / totalTasks) * 100)}%
              </p>
              <p className='text-blue-300 text-xs mt-0.5'>complete</p>
            </div>
          )}
        </div>

        {!state.selectedProject && (
          <p className='relative z-10 text-blue-300 text-sm mt-2'>
            Choose a project from the top bar to load the board.
          </p>
        )}
      </div>

      {state.loading && (
        <p className='text-sm text-gray-400 px-6 pt-4'>Loading tasks...</p>
      )}

      {/* Columns */}
      <div className='flex-1 overflow-x-auto overflow-y-hidden px-6 py-5'>
        <div className='flex gap-4 h-full items-start min-w-max'>
          {COLUMNS.map((col) => {
            const tasks = state.tasks.filter((t: Task) => t.status === col.key);
            return (
              <div key={col.key} className='w-64 flex flex-col gap-2 h-full'>
                {/* Column header */}
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

                {/* Column body */}
                <div
                  className={`flex-1 bg-white border-t-2 ${col.accent} rounded-2xl p-3 flex flex-col gap-2 overflow-y-auto border border-blue-100`}
                >
                  {tasks.length === 0 && (
                    <div className='flex-1 flex items-center justify-center'>
                      <p className='text-xs text-gray-300 text-center py-6'>
                        No tasks
                      </p>
                    </div>
                  )}
                  {tasks.map((task: Task) => (
                    <div
                      key={task._id}
                      className='bg-white border border-blue-100 rounded-xl p-3 hover:border-blue-300 hover:shadow-sm transition-all cursor-default'
                    >
                      <p className='text-sm font-medium text-gray-800 leading-snug'>
                        {task.title}
                      </p>
                      <div className='flex items-center gap-2 mt-1.5 flex-wrap'>
                        {task.assignedTo && (
                          <span className='flex items-center gap-1 text-xs text-gray-400'>
                            <span className='w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold'>
                              {task.assignedTo.username[0].toUpperCase()}
                            </span>
                            {task.assignedTo.username}
                          </span>
                        )}
                        {task.deadline && (
                          <span className='text-xs text-gray-300'>
                            {new Date(task.deadline).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' },
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KanbanView;
