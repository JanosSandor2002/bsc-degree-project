import { useState, useEffect, useRef } from 'react';
import { useViewContext } from '../../Context/ViewContext';
import { useGlobalContext } from '../../Context/GlobalContext';

const UserMenu = () => {
  const { state, dispatch: globalDispatch } = useGlobalContext();
  const { dispatch } = useViewContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const navigate = (view: any) => {
    dispatch({ type: 'SET_VIEW', payload: view });
    setOpen(false);
  };

  return (
    <div className='relative inline-block' ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className='w-18 h-12 bg-blue-400 border border-blue-300 rounded-3xl hover:bg-blue-300 transition-colors'
      >
        {state.user ? (
          <span className='text-white font-semibold text-sm px-3'>
            {state.user.username?.[0]?.toUpperCase() ?? 'U'}
          </span>
        ) : (
          <span className='text-white text-sm px-3'>User</span>
        )}
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-52 bg-white border border-blue-100 rounded-2xl shadow-lg z-50 overflow-hidden'>
          {state.user && (
            <div className='px-4 py-3 border-b border-blue-50'>
              <p className='text-sm font-semibold text-gray-800'>
                {state.user.username}
              </p>
              <p className='text-xs text-gray-400'>{state.user.email}</p>
            </div>
          )}
          <ul className='flex flex-col py-1'>
            <li
              className='px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition-colors'
              onClick={() => navigate('account')}
            >
              Account
            </li>
            <li
              className='px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition-colors'
              onClick={() => navigate('create')}
            >
              Create Project
            </li>
            <li
              className='px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 transition-colors'
              onClick={() => navigate('mails')}
            >
              Mails
            </li>
            <li className='border-t border-blue-50 mt-1'>
              {!state.user ? (
                <button
                  className='w-full text-left px-4 py-2 hover:bg-blue-50 text-sm text-blue-600 transition-colors'
                  onClick={() => navigate('sign')}
                >
                  Sign In / Sign Up
                </button>
              ) : (
                <button
                  className='w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500 transition-colors'
                  onClick={() => {
                    globalDispatch({ type: 'LOGOUT' });
                    localStorage.removeItem('token');
                    navigate('sign');
                  }}
                >
                  Log Out
                </button>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
