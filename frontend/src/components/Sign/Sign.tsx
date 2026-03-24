import { useState } from 'react';
import { useGlobalContext } from '../../Context/GlobalContext';
import { loginUser, registerUser } from '../../Context/Actions';

const Sign = () => {
  const { dispatch, state } = useGlobalContext();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

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
    <div className='flex h-full items-center justify-center gap-10 p-6'>
      {/* REGISTER */}
      <div className='bg-blue-100 p-6 rounded-3xl shadow-md w-80'>
        <h2 className='text-xl font-bold mb-4 text-center'>Register</h2>

        <form onSubmit={handleRegister} className='flex flex-col gap-3'>
          <input
            type='text'
            placeholder='Username'
            className='p-2 rounded border'
            onChange={(e) =>
              setRegisterData({ ...registerData, username: e.target.value })
            }
          />

          <input
            type='email'
            placeholder='Email'
            className='p-2 rounded border'
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
          />

          <input
            type='password'
            placeholder='Password'
            className='p-2 rounded border'
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
          />

          <button
            type='submit'
            disabled={state.loading}
            className='bg-blue-600 text-white p-2 rounded hover:bg-blue-500'
          >
            Register
          </button>
        </form>
      </div>

      {/* LOGIN */}
      <div className='bg-blue-100 p-6 rounded-3xl shadow-md w-80'>
        <h2 className='text-xl font-bold mb-4 text-center'>Login</h2>

        <form onSubmit={handleLogin} className='flex flex-col gap-3'>
          <input
            type='email'
            placeholder='Email'
            className='p-2 rounded border'
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />

          <input
            type='password'
            placeholder='Password'
            className='p-2 rounded border'
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />

          <button
            type='submit'
            disabled={state.loading}
            className='bg-green-600 text-white p-2 rounded hover:bg-green-500'
          >
            Login
          </button>
        </form>
      </div>

      {/* ERROR / LOADING */}
      <div className='absolute bottom-5 text-center'>
        {state.loading && <p>Loading...</p>}
        {state.error && <p className='text-red-500'>{state.error}</p>}
      </div>
    </div>
  );
};

export default Sign;
