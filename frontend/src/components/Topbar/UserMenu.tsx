import { useState } from 'react';

const UserMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className='relative'>
      <button
        onClick={() => setOpen(!open)}
        className='px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200'
      >
        User
      </button>
      {open && (
        <div className='absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50'>
          <ul className='flex flex-col'>
            <li className='px-4 py-2 bg-black hover:bg-gray-700 cursor-pointer'>
              Account
            </li>
            <li className='px-4 py-2 bg-black hover:bg-gray-700 cursor-pointer'>
              Create Project
            </li>
            <li className='px-4 py-2 bg-black hover:bg-gray-700 cursor-pointer'>
              Mails
            </li>
            <li className='px-4 py-2 bg-black hover:bg-gray-700 cursor-pointer'>
              Sign In / Sign Up
            </li>
            <li className='px-4 py-2 bg-black hover:bg-gray-700 cursor-pointer'>
              Log Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
