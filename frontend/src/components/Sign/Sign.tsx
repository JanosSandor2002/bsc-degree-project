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
import { loginUser, registerUser } from '../../Context/Actions';

const Sign = () => {
  const { dispatch, state } = useGlobalContext();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(dispatch, loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser(dispatch, registerData);
  };

  return (
    <div className='h-full overflow-auto'>
      {/*Hero*/}
      <div className='relative px-8 pt-10 pb-8 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-t-3xl overflow-hidden'>
        <div className='absolute -top-8 -right-8 w-56 h-56 rounded-full bg-blue-600 opacity-25' />
        <div className='absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-blue-800 opacity-30' />
        <div className='relative z-10'>
          <div className='inline-block bg-blue-500 bg-opacity-40 border border-blue-400 border-opacity-50 text-blue-100 text-xs font-medium px-3 py-1 rounded-full mb-3 tracking-wide'>
            Welcome to Acxor
          </div>
          <h1 className='text-3xl font-bold text-white mb-1'>
            {tab === 'login'
              ? 'Sign in to your account'
              : 'Create a free account'}
          </h1>
          <p className='text-blue-200 text-sm'>
            {tab === 'login'
              ? 'Good to have you back. Enter your credentials to continue.'
              : 'Join Acxor and start managing your projects today.'}
          </p>
        </div>
      </div>

      {/*Form card*/}
      <div className='px-6 py-6 flex justify-center'>
        <div className='w-full max-w-md'>
          {/* Tab switcher */}
          <div className='flex bg-blue-100 rounded-2xl p-1 mb-6'>
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                tab === 'login'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                tab === 'register'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              Register
            </button>
          </div>

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className='flex flex-col gap-3'>
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-gray-600'>
                  Email address
                </label>
                <input
                  type='email'
                  placeholder='you@example.com'
                  className='p-2.5 border border-blue-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition-colors'
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-gray-600'>
                  Password
                </label>
                <input
                  type='password'
                  placeholder='••••••••'
                  className='p-2.5 border border-blue-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition-colors'
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
              </div>
              <button
                type='submit'
                disabled={state.loading}
                className='mt-2 bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-colors'
              >
                {state.loading ? 'Signing in...' : 'Sign in →'}
              </button>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className='flex flex-col gap-3'>
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-gray-600'>
                  Username
                </label>
                <input
                  type='text'
                  placeholder='cooldev42'
                  className='p-2.5 border border-blue-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition-colors'
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-gray-600'>
                  Email address
                </label>
                <input
                  type='email'
                  placeholder='you@example.com'
                  className='p-2.5 border border-blue-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition-colors'
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />
              </div>
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-medium text-gray-600'>
                  Password
                </label>
                <input
                  type='password'
                  placeholder='••••••••'
                  className='p-2.5 border border-blue-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 transition-colors'
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type='submit'
                disabled={state.loading}
                className='mt-2 bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-2xl hover:bg-blue-600 disabled:opacity-50 transition-colors'
              >
                {state.loading ? 'Creating account...' : 'Create account →'}
              </button>
            </form>
          )}

          {/* Error */}
          {state.error && (
            <div className='mt-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2'>
              <p className='text-sm text-red-600'>{state.error}</p>
            </div>
          )}

          {/* Switch hint */}
          <p className='text-center text-xs text-gray-400 mt-5'>
            {tab === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setTab('register')}
                  className='text-blue-600 font-medium hover:text-blue-800'
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setTab('login')}
                  className='text-blue-600 font-medium hover:text-blue-800'
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Footer strip*/}
      <div className='mx-6 mb-6 bg-blue-900 rounded-2xl px-6 py-4 flex items-center justify-between gap-3'>
        <div>
          <p className='text-white font-semibold text-sm'>
            Acxor — BSc Degree Project
          </p>
          <p className='text-blue-400 text-xs mt-0.5'>
            React · Node.js · MongoDB · TypeScript
          </p>
        </div>
        <div className='shrink-0 bg-blue-700 text-blue-200 text-xs px-3 py-1.5 rounded-xl'>
          v1.0
        </div>
      </div>
    </div>
  );
};

export default Sign;
