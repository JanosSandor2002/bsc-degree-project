import { useGlobalContext } from '../../Context/GlobalContext';
import { useViewContext } from '../../Context/ViewContext';

const features = [
  {
    icon: '⠿',
    title: 'Kanban Board',
    description:
      "Visualize your workflow with a drag-ready Kanban board. Move tasks across To Do, In Progress, and Done columns and get a clear picture of your team's work at any moment.",
  },
  {
    icon: '⟳',
    title: 'Scrum Sprints',
    description:
      'Plan work in focused time-boxes. Create sprints, assign tasks from the backlog, and track velocity across iterations — all in one place.',
  },
  {
    icon: '▦',
    title: 'Plan Overview',
    description:
      'See all your projects at a glance. Progress bars and task breakdowns give you an instant read on where every project stands, without digging through details.',
  },
  {
    icon: '✦',
    title: 'Gamification',
    description:
      'Turn work into progress you can feel. Complete tasks to earn XP, level up, and climb the ranks. Staying on top of your tasks has never been this rewarding.',
  },
  {
    icon: '❐',
    title: 'Tasks & Subtasks',
    description:
      'Break down complex work into manageable pieces. Assign tasks to team members, set deadlines, and track granular subtasks so nothing slips through the cracks.',
  },
  {
    icon: '⊞',
    title: 'GitHub Integration',
    description:
      'Import projects directly from your GitHub repositories. Issues become tasks automatically — so your code and project management stay perfectly in sync.',
  },
];

const stats = [
  { value: '3', label: 'Views' },
  { value: '∞', label: 'Projects' },
  { value: 'XP', label: 'Rewards' },
  { value: 'API', label: 'GitHub sync' },
];

const MainView = () => {
  const { state } = useGlobalContext();
  const { dispatch } = useViewContext();

  return (
    <div className='h-full overflow-auto'>
      {/* Hero*/}
      <div className='relative px-8 pt-12 pb-10 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden'>
        {/* decorative circles */}
        <div className='absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-600 opacity-30' />
        <div className='absolute top-20 -right-4 w-32 h-32 rounded-full bg-blue-500 opacity-20' />
        <div className='absolute -bottom-8 left-1/3 w-48 h-48 rounded-full bg-blue-700 opacity-25' />

        <div className='relative z-10 max-w-2xl'>
          <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-4 tracking-wide'>
            Project Management · Reimagined
          </div>

          <h1 className='text-4xl font-bold text-white leading-tight mb-3'>
            Welcome to <span className='text-blue-300'>Acxor</span>
          </h1>

          <p className='text-blue-200 text-base leading-relaxed max-w-lg'>
            Acxor is a modern project management platform built for developers
            and teams who want clarity, structure, and a little motivation built
            right in. Manage tasks, run sprints, track progress — and earn
            rewards along the way.
          </p>

          {!state.user && (
            <div className='flex gap-3 mt-6'>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'sign' })}
                className='bg-white text-blue-900 font-semibold text-sm px-5 py-2.5 rounded-2xl hover:bg-blue-50 transition-colors shadow-sm'
              >
                Get started — it's free
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'sign' })}
                className='border border-blue-400 border-opacity-60 text-blue-100 text-sm px-5 py-2.5 rounded-2xl hover:bg-blue-700 transition-colors'
              >
                Sign in
              </button>
            </div>
          )}

          {state.user && (
            <div className='mt-6 flex items-center gap-3'>
              <div className='w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm'>
                {state.user.username?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div>
                <p className='text-white font-medium text-sm'>
                  Welcome back, {state.user.username}!
                </p>
                <p className='text-blue-300 text-xs'>
                  Level {state.user.level ?? 1} · {state.user.xp ?? 0} XP
                </p>
              </div>
            </div>
          )}
        </div>

        {/* stat pills */}
        <div className='relative z-10 flex gap-3 mt-8 flex-wrap'>
          {stats.map((s) => (
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

      {!state.user && (
        <div className='mx-6 -mt-4 relative z-20'>
          <div className='bg-white border border-blue-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div>
              <p className='font-semibold text-gray-800 text-sm'>
                Ready to get organised?
              </p>
              <p className='text-gray-500 text-xs mt-0.5'>
                Create a free account to start managing your projects today.
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'sign' })}
              className='shrink-0 bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-2xl transition-colors'
            >
              Create account →
            </button>
          </div>
        </div>
      )}

      {/* Features grid */}
      <div className='px-6 pt-8 pb-6'>
        <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1'>
          What's inside
        </p>
        <h2 className='text-xl font-bold text-gray-800 mb-5'>
          Everything your team needs
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {features.map((f) => (
            <div
              key={f.title}
              className='bg-white border border-blue-100 rounded-2xl p-4 hover:border-blue-300 hover:shadow-sm transition-all'
            >
              <div className='w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-lg mb-3'>
                {f.icon}
              </div>
              <p className='font-semibold text-gray-800 text-sm mb-1'>
                {f.title}
              </p>
              <p className='text-xs text-gray-500 leading-relaxed'>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className='px-6 pb-6'>
        <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1'>
          How it works
        </p>
        <h2 className='text-xl font-bold text-gray-800 mb-5'>
          Up and running in minutes
        </h2>

        <div className='flex flex-col gap-3'>
          {[
            {
              step: '01',
              title: 'Create an account',
              body: 'Register with your email and password. It takes less than a minute and your first project is one click away.',
            },
            {
              step: '02',
              title: 'Set up your project',
              body: 'Create a project manually or import one directly from GitHub. Add contributors, define task groups, and set deadlines.',
            },
            {
              step: '03',
              title: 'Manage your work',
              body: 'Use the Kanban or Scrum view to move tasks through your workflow. Break work into subtasks and assign them to team members.',
            },
            {
              step: '04',
              title: 'Track & earn',
              body: 'Monitor progress in the Plan view and complete tasks to earn XP and level up. Stay motivated as your projects move forward.',
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className='flex gap-4 items-start bg-white border border-blue-100 rounded-2xl p-4'
            >
              <div className='shrink-0 w-9 h-9 rounded-xl bg-blue-700 text-white text-xs font-bold flex items-center justify-center'>
                {item.step}
              </div>
              <div>
                <p className='font-semibold text-gray-800 text-sm'>
                  {item.title}
                </p>
                <p className='text-xs text-gray-500 mt-0.5 leading-relaxed'>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className='mx-6 mb-6 bg-blue-900 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3'>
        <div>
          <p className='text-white font-semibold text-sm'>
            Acxor — BSc Degree Project
          </p>
          <p className='text-blue-400 text-xs mt-0.5'>
            Built with React, Node.js, MongoDB & TypeScript
          </p>
        </div>
        {!state.user && (
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'sign' })}
            className='shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-xl transition-colors'
          >
            Sign in / Register
          </button>
        )}
      </div>
    </div>
  );
};

export default MainView;
