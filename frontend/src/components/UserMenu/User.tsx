/*
 * Acxor Projektmenedzsment Rendszer
 * Szerző: Sándor János, 2026
 * Miskolci Egyetem — Szakdolgozat
 *
 * Megjegyzés: egyes kódrészletek generálása, hibakeresése
 * és javítása Claude (Anthropic) MI-alapú eszköz
 * segítségével történt, minden esetben kritikus szakmai
 * felülvizsgálattal párosulva.
 */

import { useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { updateUser } from '../../Context/Actions';

const xpRequired = (level: number, prestige: number) =>
  20 + (level + 1) * 10 + prestige * level * 10;

const BADGE_LEVELS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const User = () => {
  const { state, dispatch } = useGlobalContext();
  const user = state.user;

  const [editField, setEditField] = useState<
    'username' | 'email' | 'password' | null
  >(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!state.token) return;
    setSaving(true);

    const payload: Record<string, string> = {};
    if (editField === 'username') {
      if (!formData.username.trim()) return setSaving(false);
      payload.username = formData.username.trim();
    }
    if (editField === 'email') {
      if (!formData.email.trim()) return setSaving(false);
      payload.email = formData.email.trim();
    }
    if (editField === 'password') {
      if (formData.password.length < 6) {
        showToast('Password must be at least 6 characters', false);
        setSaving(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast('Passwords do not match', false);
        setSaving(false);
        return;
      }
      payload.password = formData.password;
    }

    const result = await updateUser(dispatch, state.token, payload);
    setSaving(false);
    if ((result as any)?.success !== false) {
      showToast(
        editField === 'password'
          ? 'Password updated successfully'
          : `${editField} updated successfully`,
        true,
      );
      setEditField(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } else {
      showToast((result as any).message || 'Update failed', false);
    }
  };

  if (!user) {
    return (
      <div className='h-full flex flex-col'>
        <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl'>
          <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-2'>
            Account
          </div>
          <h1 className='text-2xl font-bold text-white'>Your Account</h1>
        </div>
        <div className='flex-1 flex items-center justify-center'>
          <p className='text-sm text-gray-400'>Sign in to view your account.</p>
        </div>
      </div>
    );
  }

  const xpNeeded = xpRequired(user.level ?? 1, user.prestige ?? 0);
  const xpPercent = Math.min(
    100,
    Math.round(((user.xp ?? 0) / xpNeeded) * 100),
  );
  const earnedBadges = BADGE_LEVELS.filter((b) => b <= (user.level ?? 1));
  const nextBadge = BADGE_LEVELS.find((b) => b > (user.level ?? 1)) ?? null;

  return (
    <div className='h-full flex flex-col'>
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 text-white text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg ${toast.ok ? 'bg-green-600' : 'bg-red-500'}`}
        >
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div className='relative px-8 pt-8 pb-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden shrink-0'>
        <div className='absolute -top-6 -right-6 w-44 h-44 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10 flex items-center gap-4'>
          {/* Avatar */}
          <div className='w-14 h-14 rounded-2xl bg-blue-500 bg-opacity-50 border border-blue-400 border-opacity-40 flex items-center justify-center text-2xl font-bold text-white shrink-0'>
            {user.username?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-1 tracking-wide'>
              Account
            </div>
            <h1 className='text-2xl font-bold text-white leading-tight'>
              {user.username}
            </h1>
            <p className='text-blue-300 text-xs mt-0.5'>{user.email}</p>
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-auto px-6 py-5 flex flex-col gap-5'>
        {/* XP Level card*/}
        <div className='bg-white border border-blue-200 rounded-2xl p-5'>
          <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3'>
            Progress
          </p>
          <div className='flex items-center gap-4 flex-wrap'>
            <div className='text-center'>
              <p className='text-3xl font-bold text-blue-700'>
                {user.level ?? 1}
              </p>
              <p className='text-xs text-gray-400'>Level</p>
            </div>
            <div className='flex-1 min-w-32'>
              <div className='flex justify-between text-xs text-gray-400 mb-1'>
                <span>{user.xp ?? 0} XP</span>
                <span>{xpNeeded} XP needed</span>
              </div>
              <div className='w-full bg-blue-100 rounded-full h-2.5'>
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${xpPercent === 100 ? 'bg-green-500' : xpPercent >= 60 ? 'bg-blue-500' : 'bg-amber-400'}`}
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <p className='text-xs text-gray-400 mt-1'>
                {nextBadge
                  ? `Next badge at level ${nextBadge}`
                  : 'Max badge tier reached'}
              </p>
            </div>
            {(user.prestige ?? 0) > 0 && (
              <div className='text-center'>
                <p className='text-xl font-bold text-purple-600'>
                  {user.prestige}
                </p>
                <p className='text-xs text-gray-400'>Prestige</p>
              </div>
            )}
          </div>

          {earnedBadges.length > 0 && (
            <div className='mt-4 pt-4 border-t border-blue-100'>
              <p className='text-xs text-gray-400 mb-2'>Earned badges</p>
              <div className='flex gap-2 flex-wrap'>
                {earnedBadges.map((b) => (
                  <span
                    key={b}
                    className='text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full'
                  >
                    Lv {b}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile info */}
        <div className='bg-white border border-blue-200 rounded-2xl p-5'>
          <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3'>
            Profile
          </p>
          <div className='flex flex-col gap-3'>
            {/* Username row */}
            <div className='flex items-center justify-between gap-3'>
              <div className='min-w-0'>
                <p className='text-xs text-gray-400'>Username</p>
                {editField === 'username' ? (
                  <input
                    type='text'
                    defaultValue={user.username}
                    autoFocus
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className='mt-1 p-1.5 border border-blue-200 rounded-lg text-sm w-full max-w-xs'
                  />
                ) : (
                  <p className='text-sm font-medium text-gray-800'>
                    {user.username}
                  </p>
                )}
              </div>
              <div className='flex gap-2 shrink-0'>
                {editField === 'username' ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className='text-xs bg-blue-700 text-white px-3 py-1 rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-colors'
                    >
                      {saving ? '...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditField(null)}
                      className='text-xs border border-gray-200 text-gray-500 px-2 py-1 rounded-lg hover:bg-gray-50'
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditField('username')}
                    className='text-xs border border-blue-200 text-blue-700 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors'
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className='h-px bg-blue-50' />

            {/* Email row */}
            <div className='flex items-center justify-between gap-3'>
              <div className='min-w-0'>
                <p className='text-xs text-gray-400'>Email</p>
                {editField === 'email' ? (
                  <input
                    type='email'
                    defaultValue={user.email}
                    autoFocus
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className='mt-1 p-1.5 border border-blue-200 rounded-lg text-sm w-full max-w-xs'
                  />
                ) : (
                  <p className='text-sm font-medium text-gray-800'>
                    {user.email}
                  </p>
                )}
              </div>
              <div className='flex gap-2 shrink-0'>
                {editField === 'email' ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className='text-xs bg-blue-700 text-white px-3 py-1 rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-colors'
                    >
                      {saving ? '...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditField(null)}
                      className='text-xs border border-gray-200 text-gray-500 px-2 py-1 rounded-lg hover:bg-gray-50'
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditField('email')}
                    className='text-xs border border-blue-200 text-blue-700 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors'
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className='h-px bg-blue-50' />

            {/* Password row */}
            <div className='flex items-center justify-between gap-3'>
              <div className='min-w-0 flex-1'>
                <p className='text-xs text-gray-400'>Password</p>
                {editField === 'password' ? (
                  <div className='flex flex-col gap-2 mt-1'>
                    <input
                      type='password'
                      placeholder='New password (min. 6 chars)'
                      autoFocus
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className='p-1.5 border border-blue-200 rounded-lg text-sm max-w-xs'
                    />
                    <input
                      type='password'
                      placeholder='Confirm new password'
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className='p-1.5 border border-blue-200 rounded-lg text-sm max-w-xs'
                    />
                  </div>
                ) : (
                  <p className='text-sm font-medium text-gray-800'>••••••••</p>
                )}
              </div>
              <div className='flex gap-2 shrink-0'>
                {editField === 'password' ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className='text-xs bg-blue-700 text-white px-3 py-1 rounded-lg hover:bg-blue-600 disabled:opacity-40 transition-colors'
                    >
                      {saving ? '...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditField(null)}
                      className='text-xs border border-gray-200 text-gray-500 px-2 py-1 rounded-lg hover:bg-gray-50'
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditField('password')}
                    className='text-xs border border-blue-200 text-blue-700 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors'
                  >
                    Change
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/*Stats */}
        <div className='bg-white border border-blue-200 rounded-2xl p-5'>
          <p className='text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3'>
            Stats
          </p>
          <div className='grid grid-cols-2 gap-3'>
            {[
              { label: 'Projects', value: state.projects.length },
              { label: 'XP total', value: user.xp ?? 0 },
              { label: 'Level', value: user.level ?? 1 },
              { label: 'Prestige', value: user.prestige ?? 0 },
            ].map((s) => (
              <div key={s.label} className='bg-blue-50 rounded-xl px-3 py-2.5'>
                <p className='text-xs text-gray-400'>{s.label}</p>
                <p className='text-xl font-bold text-blue-700 mt-0.5'>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/*Footer*/}
        <div className='bg-blue-900 rounded-2xl px-6 py-4 mt-auto'>
          <p className='text-white font-semibold text-sm'>
            Acxor — BSc Degree Project
          </p>
          <p className='text-blue-400 text-xs mt-0.5'>
            React · Node.js · MongoDB · TypeScript
          </p>
        </div>
      </div>
    </div>
  );
};

export default User;
