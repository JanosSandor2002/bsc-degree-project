import { useState } from 'react';

const UserMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex justify-between'>
      <button
        onClick={() => setOpen(!open)}
        className='w-18 h-12 bg-blue-300 border border-blue-300 rounded-3xl hover:bg-blue-200'
      >
        User
      </button>
      {open && (
        <div className='absolute right-0 mt-2 w-48 bg-blue-400 border rounded shadow-lg z-50'>
          <ul className='flex flex-col'>
            <li className='px-4 py-2 hover:bg-blue-200 cursor-pointer'>
              Account
            </li>
            <li className='px-4 py-2 hover:bg-blue-200 cursor-pointer'>
              Create Project
            </li>
            <li className='px-4 py-2 hover:bg-blue-200 cursor-pointer'>
              Mails
            </li>
            <li className='px-4 py-2 hover:bg-blue-200 cursor-pointer'>
              Sign In / Sign Up
            </li>
            <li className='px-4 py-2 hover:bg-blue-200 cursor-pointer'>
              Log Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
