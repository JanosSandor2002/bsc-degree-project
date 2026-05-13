import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

type Task = { _id: string; status: 'Open' | 'InProgress' | 'Done' };
type ProjectStats = {
  total: number;
  done: number;
  inProgress: number;
  open: number;
};

const getProgressColor = (p: number) =>
  p === 100
    ? 'bg-green-500'
    : p >= 60
      ? 'bg-blue-500'
      : p >= 30
        ? 'bg-amber-400'
        : 'bg-red-400';

const getLabel = (p: number) => {
  if (p === 100)
    return { text: 'Completed', cls: 'bg-green-100 text-green-800' };
  if (p >= 60) return { text: 'On track', cls: 'bg-blue-100 text-blue-800' };
  if (p >= 30)
    return { text: 'In progress', cls: 'bg-amber-100 text-amber-800' };
  if (p > 0)
    return { text: 'Just started', cls: 'bg-orange-100 text-orange-800' };
  return { text: 'Not started', cls: 'bg-gray-100 text-gray-600' };
};

const PlanView = () => {
  const { state } = useGlobalContext();
  const [statsMap, setStatsMap] = useState<Record<string, ProjectStats>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state.token || state.projects.length === 0) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          state.projects.map((p: any) =>
            axios
              .get(`${API_URL}/tasks/project/${p._id}`, {
                headers: { Authorization: `Bearer ${state.token}` },
              })
              .then((res) => ({ id: p._id, tasks: res.data as Task[] }))
              .catch(() => ({ id: p._id, tasks: [] })),
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
    fetchAll();
  }, [state.projects, state.token]);

  const totalProjects = state.projects.length;
  const completedProjects = Object.values(statsMap).filter(
    (s) => s.total > 0 && s.done === s.total,
  ).length;

  return (
    <div className='h-full overflow-auto'>
      <div className='relative px-8 pt-10 pb-8 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden'>
        <div className='absolute -top-8 -right-8 w-56 h-56 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10'>
          <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-3 tracking-wide'>
            Plan
          </div>
          <h1 className='text-3xl font-bold text-white mb-1'>
            Project Overview
          </h1>
          <p className='text-blue-200 text-sm max-w-lg leading-relaxed'>
            Track progress across all your projects at a glance. Each card shows
            task completion, current status, and a visual progress indicator.
          </p>
        </div>
        <div className='relative z-10 flex gap-3 mt-6 flex-wrap'>
          {[
            { value: String(totalProjects), label: 'Projects' },
            { value: String(completedProjects), label: 'Completed' },
            {
              value: String(totalProjects - completedProjects),
              label: 'Active',
            },
          ].map((s) => (
            <div
              key={s.label}
              className='bg-blue-800 bg-opacity-60 border border-blue-600 border-opacity-40 rounded-2xl px-4 py-2 text-center'
            >
              <p className='text-white font-bold text-lg leading-none'>
                {s.value}
              </p>
              <p className='text-blue-300 text-xs mt-0.5'>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/*Cards  */}
      <div className='px-6 py-6 flex flex-col gap-4'>
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

        {state.projects.map((project: any) => {
          const stats = statsMap[project._id];
          const percent = stats
            ? stats.total === 0
              ? 0
              : Math.round((stats.done / stats.total) * 100)
            : null;
          const label = percent !== null ? getLabel(percent) : null;

          return (
            <div
              key={project._id}
              className='bg-white border border-blue-200 rounded-2xl p-5 flex flex-col gap-4 hover:border-blue-300 hover:shadow-sm transition-all'
            >
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

              {stats !== undefined ? (
                <div>
                  <div className='flex justify-between text-xs text-gray-400 mb-1.5'>
                    <span>Progress</span>
                    <span className='font-semibold text-gray-600'>
                      {percent}%
                    </span>
                  </div>
                  <div className='w-full bg-blue-100 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${getProgressColor(percent!)}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className='w-full bg-blue-100 rounded-full h-2 animate-pulse' />
              )}

              {stats !== undefined && (
                <div className='flex gap-5 flex-wrap'>
                  {[
                    { dot: 'bg-green-500', label: 'Done', val: stats.done },
                    {
                      dot: 'bg-amber-400',
                      label: 'In progress',
                      val: stats.inProgress,
                    },
                    { dot: 'bg-blue-300', label: 'Open', val: stats.open },
                    { dot: 'bg-gray-300', label: 'Total', val: stats.total },
                  ].map((s) => (
                    <div key={s.label} className='flex items-center gap-1.5'>
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <span className='text-xs text-gray-400'>
                        {s.label}:{' '}
                        <span className='font-medium text-gray-700'>
                          {s.val}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {state.projects.length > 0 && (
        <div className='mx-6 mb-6 bg-blue-900 rounded-2xl px-6 py-4'>
          <p className='text-white font-semibold text-sm'>Keep shipping.</p>
          <p className='text-blue-400 text-xs mt-0.5'>
            Complete tasks to move your projects forward.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlanView;
