import { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

type LogEntry = {
  _id: string;
  message: string;
  createdAt: string;
  user?: { username: string } | null;
};

const getIcon = (msg: string) => {
  if (msg.startsWith('Task completed'))
    return { icon: '✓', cls: 'bg-green-100 text-green-700' };
  if (msg.startsWith('Task created'))
    return { icon: '+', cls: 'bg-blue-100 text-blue-700' };
  if (msg.startsWith('Task deleted'))
    return { icon: '✕', cls: 'bg-red-100 text-red-600' };
  if (msg.startsWith('Task updated'))
    return { icon: '✎', cls: 'bg-amber-100 text-amber-700' };
  if (msg.startsWith('Task assigned'))
    return { icon: '⟶', cls: 'bg-purple-100 text-purple-700' };
  if (msg.startsWith('Subtask completed'))
    return { icon: '✓', cls: 'bg-green-50 text-green-600' };
  if (msg.startsWith('Subtask created'))
    return { icon: '+', cls: 'bg-blue-50 text-blue-600' };
  if (msg.startsWith('Subtask deleted'))
    return { icon: '✕', cls: 'bg-red-50 text-red-500' };
  if (msg.startsWith('Subtask updated'))
    return { icon: '✎', cls: 'bg-amber-50 text-amber-600' };
  if (msg.startsWith('Sprint created'))
    return { icon: '⟳', cls: 'bg-indigo-100 text-indigo-700' };
  if (msg.startsWith('Sprint deleted'))
    return { icon: '✕', cls: 'bg-red-100 text-red-600' };
  if (msg.startsWith('Sprint updated'))
    return { icon: '✎', cls: 'bg-indigo-50 text-indigo-600' };
  return { icon: '•', cls: 'bg-gray-100 text-gray-500' };
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const groupByDate = (logs: LogEntry[]) => {
  const groups: { label: string; entries: LogEntry[] }[] = [];
  const seen = new Map<string, LogEntry[]>();
  logs.forEach((log) => {
    const d = new Date(log.createdAt);
    const now = new Date();
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    const label =
      d.toDateString() === now.toDateString()
        ? 'Today'
        : d.toDateString() === yest.toDateString()
          ? 'Yesterday'
          : d.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            });
    if (!seen.has(label)) {
      seen.set(label, []);
      groups.push({ label, entries: seen.get(label)! });
    }
    seen.get(label)!.push(log);
  });
  return groups;
};

const LogView = () => {
  const { state } = useGlobalContext();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLogs = async (silent = false) => {
    if (!state.token || !state.selectedProject?._id) return;
    if (!silent) setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/logs/project/${state.selectedProject._id}`,
        {
          headers: { Authorization: `Bearer ${state.token}` },
        },
      );
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    setLogs([]);
    fetchLogs();
    intervalRef.current = setInterval(() => fetchLogs(true), 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.selectedProject?._id, state.token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  const groups = groupByDate(logs);

  return (
    <div className='h-full flex flex-col overflow-hidden'>
      {/* Hero */}
      <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden shrink-0'>
        <div className='absolute -top-6 -right-6 w-44 h-44 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10 flex items-center justify-between gap-4 flex-wrap'>
          <div>
            <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-2 tracking-wide'>
              Activity Log
            </div>
            <h1 className='text-2xl font-bold text-white'>
              {state.selectedProject
                ? state.selectedProject.name
                : 'Select a project'}
            </h1>
            {state.selectedProject && (
              <p className='text-blue-300 text-xs mt-1'>
                {logs.length} event{logs.length !== 1 ? 's' : ''} ·
                auto-refreshes every 10s
              </p>
            )}
          </div>
          {state.selectedProject && (
            <button
              onClick={() => fetchLogs()}
              className='shrink-0 bg-white text-blue-900 font-semibold text-xs px-4 py-2 rounded-2xl hover:bg-blue-50 transition-colors'
            >
              ↻ Refresh
            </button>
          )}
        </div>
      </div>

      {/* Feed */}
      <div className='flex-1 overflow-auto px-6 py-4 flex flex-col gap-1'>
        {!state.selectedProject && (
          <div className='flex-1 flex items-center justify-center py-12'>
            <p className='text-sm text-gray-400'>
              Select a project in the top bar to see its activity log.
            </p>
          </div>
        )}

        {state.selectedProject && loading && logs.length === 0 && (
          <p className='text-sm text-gray-400'>Loading activity...</p>
        )}

        {state.selectedProject && !loading && logs.length === 0 && (
          <div className='flex flex-col items-center justify-center flex-1 gap-2 py-12'>
            <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 text-lg'>
              ◎
            </div>
            <p className='text-sm text-gray-400'>
              No activity yet for this project.
            </p>
            <p className='text-xs text-gray-300'>
              Creating tasks, completing them, or managing sprints will appear
              here.
            </p>
          </div>
        )}

        {groups.map((group) => (
          <div key={group.label}>
            <div className='flex items-center gap-3 my-3'>
              <div className='flex-1 h-px bg-blue-100' />
              <span className='text-xs font-medium text-gray-400 shrink-0'>
                {group.label}
              </span>
              <div className='flex-1 h-px bg-blue-100' />
            </div>
            {[...group.entries].reverse().map((log) => {
              const { icon, cls } = getIcon(log.message);
              return (
                <div
                  key={log._id}
                  className='flex items-start gap-3 py-1.5 hover:bg-blue-50 rounded-xl px-2 transition-colors group'
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${cls}`}
                  >
                    {icon}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-gray-800 leading-snug'>
                      {log.message}
                    </p>
                    <div className='flex items-center gap-2 mt-0.5'>
                      {log.user && (
                        <span className='text-xs text-blue-500'>
                          {log.user.username}
                        </span>
                      )}
                      <span className='text-xs text-gray-300'>
                        {formatTime(log.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default LogView;
