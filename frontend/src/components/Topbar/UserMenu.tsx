import { useState } from 'react';
import { useViewContext } from '../../Context/ViewContext';

const UserMenu = () => {
  const { dispatch } = useViewContext();
  const [open, setOpen] = useState(false);

  return (
    <div className='relative inline-block'>
      <button
        onClick={() => setOpen(!open)}
        className='w-18 h-12 bg-blue-400 border border-blue-300 rounded-3xl hover:bg-blue-300'
      >
        User
      </button>
      {open && (
        <div className='absolute right-0 mt-2 w-48 bg-blue-400 border rounded shadow-lg z-50'>
          <ul className='flex flex-col text-center'>
            <li
              className='px-4 py-2 hover:bg-blue-200 cursor-pointer'
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'account' })}
            >
              Account
            </li>
            <li
              className='px-4 py-2 hover:bg-blue-200 cursor-pointer'
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'create' })}
            >
              Create Project
            </li>
            <li
              className='px-4 py-2 hover:bg-blue-200 cursor-pointer'
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'mails' })}
            >
              Mails
            </li>
            <li
              className='px-4 py-2 hover:bg-blue-200 cursor-pointer'
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'sign' })}
            >
              Sign In / Sign Up
            </li>
            <li
              className='px-4 py-2 hover:bg-blue-200 cursor-pointer'
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'quit' })}
            >
              Log Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
