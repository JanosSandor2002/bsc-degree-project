import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

type Task = {
  _id: string;
  status: 'Open' | 'InProgress' | 'Done';
};

type ProjectStats = {
  total: number;
  done: number;
  inProgress: number;
  open: number;
};

const PlanView = () => {
  const { state } = useGlobalContext();
  const [statsMap, setStatsMap] = useState<Record<string, ProjectStats>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.token || state.projects.length === 0) return;

    const fetchAllStats = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          state.projects.map((project: any) =>
            axios
              .get(`${API_URL}/tasks/project/${project._id}`, {
                headers: { Authorization: `Bearer ${state.token}` },
              })
              .then((res) => ({ id: project._id, tasks: res.data as Task[] }))
              .catch(() => ({ id: project._id, tasks: [] })),
          ),
        );

        const map: Record<string, ProjectStats> = {};
        results.forEach(({ id, tasks }) => {
          map[id] = {
            total: tasks.length,
            done: tasks.filter((t) => t.status === 'Done').length,
            inProgress: tasks.filter((t) => t.status === 'InProgress').length,
            open: tasks.filter((t) => t.status === 'Open').length,
          };
        });
        setStatsMap(map);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, [state.projects, state.token]);

  const getProgressPercent = (stats: ProjectStats) => {
    if (stats.total === 0) return 0;
    return Math.round((stats.done / stats.total) * 100);
  };

  const getProgressColor = (percent: number) => {
    if (percent === 100) return 'bg-green-500';
    if (percent >= 60) return 'bg-blue-500';
    if (percent >= 30) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const getProgressLabel = (percent: number) => {
    if (percent === 100)
      return { text: 'Completed', cls: 'bg-green-100 text-green-800' };
    if (percent >= 60)
      return { text: 'On track', cls: 'bg-blue-100 text-blue-800' };
    if (percent >= 30)
      return { text: 'In progress', cls: 'bg-amber-100 text-amber-800' };
    if (percent > 0)
      return { text: 'Just started', cls: 'bg-orange-100 text-orange-800' };
    return { text: 'Not started', cls: 'bg-gray-100 text-gray-600' };
  };

  return (
    <div className='p-6 flex flex-col gap-6 overflow-auto'>
      {/* Header + description */}
      <div>
        <h2 className='text-2xl font-bold mb-1'>Plan</h2>
        <p className='text-sm text-gray-500 max-w-xl'>
          The Plan view gives you a high-level overview of all your projects and
          their current progress. Each project card shows how many tasks have
          been completed, are in progress, or are still open — along with a
          visual progress bar so you can instantly see where things stand.
        </p>
      </div>

      {/* No projects */}
      {!state.token && (
        <p className='text-sm text-gray-400'>Sign in to see your projects.</p>
      )}
      {state.token && state.projects.length === 0 && !loading && (
        <p className='text-sm text-gray-400'>
          No projects yet. Create one from the User menu.
        </p>
      )}

      {loading && (
        <p className='text-sm text-gray-400'>Loading project stats...</p>
      )}

      {/* Project cards */}
      <div className='flex flex-col gap-4'>
        {state.projects.map((project: any) => {
          const stats = statsMap[project._id];
          const percent = stats ? getProgressPercent(stats) : null;
          const label = percent !== null ? getProgressLabel(percent) : null;
          const progressColor =
            percent !== null ? getProgressColor(percent) : '';

          return (
            <div
              key={project._id}
              className='bg-white border border-blue-200 rounded-2xl p-5 flex flex-col gap-4'
            >
              {/* Top row */}
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p className='font-semibold text-gray-800 text-base'>
                    {project.name}
                  </p>
                  {project.description && (
                    <p className='text-sm text-gray-400 mt-0.5'>
                      {project.description}
                    </p>
                  )}
                </div>
                {label && (
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${label.cls}`}
                  >
                    {label.text}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {stats !== undefined ? (
                <div className='flex flex-col gap-1.5'>
                  <div className='flex items-center justify-between text-xs text-gray-500'>
                    <span>Progress</span>
                    <span className='font-medium text-gray-700'>
                      {percent}%
                    </span>
                  </div>
                  <div className='w-full bg-blue-100 rounded-full h-2.5'>
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${progressColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className='w-full bg-blue-100 rounded-full h-2.5 animate-pulse' />
              )}

              {/* Task stats */}
              {stats !== undefined && (
                <div className='flex gap-4 flex-wrap'>
                  <div className='flex items-center gap-1.5'>
                    <span className='w-2 h-2 rounded-full bg-green-500 inline-block' />
                    <span className='text-xs text-gray-500'>
                      Done:{' '}
                      <span className='font-medium text-gray-700'>
                        {stats.done}
                      </span>
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span className='w-2 h-2 rounded-full bg-amber-400 inline-block' />
                    <span className='text-xs text-gray-500'>
                      In progress:{' '}
                      <span className='font-medium text-gray-700'>
                        {stats.inProgress}
                      </span>
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span className='w-2 h-2 rounded-full bg-blue-300 inline-block' />
                    <span className='text-xs text-gray-500'>
                      Open:{' '}
                      <span className='font-medium text-gray-700'>
                        {stats.open}
                      </span>
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span className='w-2 h-2 rounded-full bg-gray-300 inline-block' />
                    <span className='text-xs text-gray-500'>
                      Total:{' '}
                      <span className='font-medium text-gray-700'>
                        {stats.total}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanView;
