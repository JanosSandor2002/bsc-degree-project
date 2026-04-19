import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// ── XP formula ──────────────────────────────────────────────────────────────
// XP required to level up = 20 + (next_level * 10) + (prestige * level * 10)
const xpRequired = (level: number, prestige: number) =>
  20 + (level + 1) * 10 + prestige * level * 10;

// ── Badge milestones ─────────────────────────────────────────────────────────
const BADGE_LEVELS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const CLASS_OPTIONS: Record<
  number,
  { name: string; color: string; bg: string }[]
> = {
  5: [
    { name: 'Freelancer', color: 'text-blue-700', bg: 'bg-blue-100' },
    { name: 'Swordsman', color: 'text-red-700', bg: 'bg-red-100' },
    { name: 'Archer', color: 'text-green-700', bg: 'bg-green-100' },
  ],
  10: [
    { name: 'Engineer', color: 'text-purple-700', bg: 'bg-purple-100' },
    { name: 'Knight', color: 'text-red-700', bg: 'bg-red-100' },
    { name: 'Scout', color: 'text-green-700', bg: 'bg-green-100' },
  ],
  15: [
    { name: 'Architect', color: 'text-indigo-700', bg: 'bg-indigo-100' },
    { name: 'Paladin', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    { name: 'Ranger', color: 'text-teal-700', bg: 'bg-teal-100' },
  ],
  20: [
    { name: 'Lead Dev', color: 'text-blue-800', bg: 'bg-blue-100' },
    { name: 'Warlord', color: 'text-red-800', bg: 'bg-red-100' },
    { name: 'Assassin', color: 'text-gray-700', bg: 'bg-gray-100' },
  ],
  25: [
    { name: 'Principal', color: 'text-violet-700', bg: 'bg-violet-100' },
    { name: 'Champion', color: 'text-orange-700', bg: 'bg-orange-100' },
    { name: 'Phantom', color: 'text-slate-700', bg: 'bg-slate-100' },
  ],
  30: [
    { name: 'CTO', color: 'text-sky-800', bg: 'bg-sky-100' },
    { name: 'Berserker', color: 'text-red-900', bg: 'bg-red-100' },
    { name: 'Shadowblade', color: 'text-zinc-700', bg: 'bg-zinc-100' },
  ],
  35: [
    { name: 'Visionary', color: 'text-fuchsia-700', bg: 'bg-fuchsia-100' },
    { name: 'Titan', color: 'text-rose-700', bg: 'bg-rose-100' },
    { name: 'Specter', color: 'text-neutral-600', bg: 'bg-neutral-100' },
  ],
  40: [
    { name: 'Innovator', color: 'text-cyan-700', bg: 'bg-cyan-100' },
    { name: 'Overlord', color: 'text-red-800', bg: 'bg-red-50' },
    { name: 'Wraith', color: 'text-gray-800', bg: 'bg-gray-100' },
  ],
  45: [
    { name: 'Sage', color: 'text-emerald-700', bg: 'bg-emerald-100' },
    { name: 'Warchief', color: 'text-amber-700', bg: 'bg-amber-100' },
    { name: 'Revenant', color: 'text-slate-800', bg: 'bg-slate-100' },
  ],
  50: [
    { name: 'Legend', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    { name: 'Godslayer', color: 'text-red-900', bg: 'bg-red-100' },
    { name: 'Void Walker', color: 'text-purple-900', bg: 'bg-purple-100' },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const getPrestigeLabel = (prestige: number) => {
  if (prestige === 0) return null;
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  return roman[prestige - 1] ?? `${prestige}`;
};

const nextBadgeLevel = (level: number) =>
  BADGE_LEVELS.find((b) => b > level) ?? null;

type ContributorUser = {
  _id: string;
  username: string;
  xp: number;
  level: number;
  prestige: number;
  avatar?: string;
};

const GamificationView = () => {
  const { state } = useGlobalContext();
  const [contributors, setContributors] = useState<ContributorUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  useEffect(() => {
    if (!state.token || !state.selectedProject?._id) {
      setContributors([]);
      return;
    }

    const fetchContributors = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/projects/${state.selectedProject._id}`,
          { headers: { Authorization: `Bearer ${state.token}` } },
        );
        const project = res.data;
        // contributors + admin merged, deduplicated
        const all: ContributorUser[] = [];
        const seen = new Set<string>();
        [...(project.contributors ?? []), project.admin].forEach((u: any) => {
          if (u && u._id && !seen.has(u._id)) {
            seen.add(u._id);
            all.push(u);
          }
        });
        setContributors(all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, [state.selectedProject?._id, state.token]);

  // Sort by XP desc to find top performer
  const sorted = [...contributors].sort(
    (a, b) => b.level * 10000 + b.xp - (a.level * 10000 + a.xp),
  );
  const topId = sorted[0]?._id;

  return (
    <div className='h-full overflow-auto'>
      {/* ── Hero ── */}
      <div className='relative px-8 pt-10 pb-8 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden'>
        <div className='absolute -top-8 -right-8 w-56 h-56 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10'>
          <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-3 tracking-wide'>
            Gamification
          </div>
          <h1 className='text-3xl font-bold text-white mb-2'>
            Level up your team
          </h1>
          <p className='text-blue-200 text-sm max-w-lg leading-relaxed'>
            Earn XP by completing tasks and subtasks, level up through prestige
            tiers, and unlock class badges as you and your team make progress.
            The more you ship, the more you grow.
          </p>
        </div>

        {/* XP reward pills */}
        <div className='relative z-10 flex gap-2 mt-6 flex-wrap'>
          {[
            { label: 'Task done', xp: '+5 XP' },
            { label: 'Subtask done', xp: '+3 XP' },
            { label: 'Sprint closed', xp: '+30 XP' },
            { label: 'Top performer', xp: '+10 XP' },
          ].map((r) => (
            <div
              key={r.label}
              className='bg-blue-800 bg-opacity-60 border border-blue-600 border-opacity-40 rounded-2xl px-3 py-1.5 flex items-center gap-2'
            >
              <span className='text-green-300 font-bold text-xs'>{r.xp}</span>
              <span className='text-blue-300 text-xs'>{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='px-6 py-6 flex flex-col gap-6'>
        {/* ── How it works accordion ── */}
        <div className='bg-white border border-blue-100 rounded-2xl overflow-hidden'>
          <button
            className='w-full flex items-center justify-between px-5 py-4 text-left'
            onClick={() => setOpenInfo(!openInfo)}
          >
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center text-sm shrink-0'>
                ✦
              </div>
              <span className='font-bold text-gray-800 text-base'>
                How the XP & leveling system works
              </span>
            </div>
            <span
              className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${openInfo ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700'}`}
              style={{
                transform: openInfo ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              +
            </span>
          </button>

          {openInfo && (
            <div className='border-t border-blue-100 px-5 pb-5'>
              <div className='flex flex-col gap-4 pt-4'>
                {/* Formula */}
                <div>
                  <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2'>
                    XP Formula
                  </p>
                  <div className='bg-blue-50 border border-blue-200 rounded-xl px-4 py-3'>
                    <p className='font-mono text-sm text-blue-900 font-semibold'>
                      XP required = 20 + (next_level × 10) + (prestige × level ×
                      10)
                    </p>
                  </div>
                  <div className='mt-2 flex flex-col gap-1'>
                    {[
                      {
                        label: 'Prestige 0, Level 1 → 2',
                        calc: '20 + (2×10) + (0×1×10)',
                        result: '40 XP',
                      },
                      {
                        label: 'Prestige 0, Level 4 → 5',
                        calc: '20 + (5×10) + (0×4×10)',
                        result: '70 XP',
                      },
                      {
                        label: 'Prestige 1, Level 1 → 2',
                        calc: '20 + (2×10) + (1×1×10)',
                        result: '50 XP',
                      },
                    ].map((ex) => (
                      <div
                        key={ex.label}
                        className='flex items-center gap-2 text-xs text-gray-500 flex-wrap'
                      >
                        <span className='font-medium text-gray-700'>
                          {ex.label}:
                        </span>
                        <span className='font-mono text-gray-500'>
                          {ex.calc}
                        </span>
                        <span className='font-bold text-blue-700'>
                          = {ex.result}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prestige */}
                <div>
                  <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2'>
                    Prestige System
                  </p>
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    Every time you reach{' '}
                    <span className='font-semibold text-gray-800'>
                      level 50
                    </span>
                    , you can prestige. Your level resets to 1, but your
                    prestige counter increases — raising the XP cost for every
                    future level. Prestige is a long-term goal that visually
                    distinguishes veteran contributors.
                  </p>
                </div>

                {/* Badges */}
                <div>
                  <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2'>
                    Class Badges
                  </p>
                  <p className='text-sm text-gray-600 mb-3'>
                    At levels 5, 10, 15 … 50 you unlock a class badge. Each
                    milestone offers 3 classes to choose from, each with a
                    unique title and profile background.
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {BADGE_LEVELS.map((lvl) => (
                      <div
                        key={lvl}
                        className='bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5 text-center'
                      >
                        <p className='text-xs font-bold text-blue-800'>
                          Lv {lvl}
                        </p>
                        <p className='text-xs text-blue-500 mt-0.5'>
                          {CLASS_OPTIONS[lvl]?.map((c) => c.name).join(' / ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Project contributor leaderboard ── */}
        <div>
          <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1'>
            Project leaderboard
          </p>
          <h2 className='text-xl font-bold text-gray-800 mb-1'>
            {state.selectedProject
              ? state.selectedProject.name
              : 'No project selected'}
          </h2>
          {!state.selectedProject && (
            <p className='text-sm text-gray-400'>
              Select a project from the top bar to see contributor stats.
            </p>
          )}
          {loading && (
            <p className='text-sm text-gray-400'>Loading contributors...</p>
          )}

          {!loading && contributors.length === 0 && state.selectedProject && (
            <p className='text-sm text-gray-400'>
              No contributors found for this project.
            </p>
          )}

          <div className='flex flex-col gap-3 mt-3'>
            {sorted.map((user, idx) => {
              const xpNeeded = xpRequired(user.level, user.prestige);
              const progress = Math.min(
                100,
                Math.round((user.xp / xpNeeded) * 100),
              );
              const isTop = user._id === topId && sorted.length > 1;
              const prestigeLabel = getPrestigeLabel(user.prestige);
              const nextBadge = nextBadgeLevel(user.level);
              const earnedBadges = BADGE_LEVELS.filter((b) => b <= user.level);
              const latestClass =
                CLASS_OPTIONS[earnedBadges[earnedBadges.length - 1]];

              return (
                <div
                  key={user._id}
                  className={`bg-white rounded-2xl p-4 flex flex-col gap-3 border-2 transition-all ${
                    isTop ? 'border-yellow-300' : 'border-blue-100'
                  }`}
                >
                  {/* Top row */}
                  <div className='flex items-center gap-3'>
                    {/* Rank */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        idx === 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : idx === 1
                            ? 'bg-gray-100 text-gray-600'
                            : idx === 2
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Avatar */}
                    <div className='w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm shrink-0'>
                      {user.username?.[0]?.toUpperCase() ?? '?'}
                    </div>

                    {/* Name + badges */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <span className='font-semibold text-gray-800 text-sm'>
                          {user.username}
                        </span>
                        {isTop && (
                          <span className='text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium'>
                            ★ Top performer
                          </span>
                        )}
                        {prestigeLabel && (
                          <span className='text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium'>
                            Prestige {prestigeLabel}
                          </span>
                        )}
                        {latestClass && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${latestClass[0].bg} ${latestClass[0].color}`}
                          >
                            {latestClass[0].name}
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-gray-400 mt-0.5'>
                        Level {user.level} · {user.xp} / {xpNeeded} XP
                        {nextBadge
                          ? ` · Next badge at Lv ${nextBadge}`
                          : ' · Max badge tier'}
                      </p>
                    </div>

                    {/* Level badge */}
                    <div className='shrink-0 text-right'>
                      <div className='text-xl font-bold text-blue-700 leading-none'>
                        {user.level}
                      </div>
                      <div className='text-xs text-gray-400'>level</div>
                    </div>
                  </div>

                  {/* XP progress bar */}
                  <div>
                    <div className='flex justify-between text-xs text-gray-400 mb-1'>
                      <span>XP progress</span>
                      <span className='font-medium text-gray-600'>
                        {progress}%
                      </span>
                    </div>
                    <div className='w-full bg-blue-100 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          progress === 100
                            ? 'bg-green-500'
                            : progress >= 60
                              ? 'bg-blue-500'
                              : progress >= 30
                                ? 'bg-amber-400'
                                : 'bg-red-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Earned badges row */}
                  {earnedBadges.length > 0 && (
                    <div className='flex gap-1.5 flex-wrap'>
                      {earnedBadges.map((b) => (
                        <span
                          key={b}
                          className='text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full'
                        >
                          Lv {b}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className='mx-6 mb-6 bg-blue-900 rounded-2xl px-6 py-4 flex items-center justify-between gap-3'>
        <div>
          <p className='text-white font-semibold text-sm'>
            Keep shipping, keep leveling.
          </p>
          <p className='text-blue-400 text-xs mt-0.5'>
            Complete tasks to earn XP and climb the leaderboard.
          </p>
        </div>
        <div className='shrink-0 bg-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-xl'>
          ✦ Gamification
        </div>
      </div>
    </div>
  );
};

export default GamificationView;
