import { render, screen, fireEvent } from '@testing-library/react';
import Sign from '../../components/Sign/Sign';
import * as GlobalContext from '../../Context/GlobalContext';
import * as Actions from '../../Context/Actions';
import { vi } from 'vitest';

describe('Sign', () => {
  const dispatch = vi.fn();

  const fullMockState = {
    user: null,
    token: null,
    projects: [],
    tasks: [],
    subtasks: [],
    loading: false,
    error: null,
    selectedProject: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mockoljuk a useGlobalContext-et alapértelmezett állapottal
    vi.spyOn(GlobalContext, 'useGlobalContext').mockReturnValue({
      state: { ...fullMockState },
      dispatch,
    });

    // Mockoljuk az Actions függvényeket
    vi.spyOn(Actions, 'loginUser').mockImplementation(vi.fn());
    vi.spyOn(Actions, 'registerUser').mockImplementation(vi.fn());
  });

  it('rendereli a Sign komponenst', () => {
    render(<Sign />);

    // H2 elemeket külön szűrjük
    const headings = screen.getAllByRole('heading');
    expect(
      headings.find((h) => h.textContent === 'Register'),
    ).toBeInTheDocument();
    expect(headings.find((h) => h.textContent === 'Login')).toBeInTheDocument();

    // Input mezők ellenőrzése
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    const emailInputs = screen.getAllByPlaceholderText('Email');
    expect(emailInputs.length).toBe(2);
    const passwordInputs = screen.getAllByPlaceholderText('Password');
    expect(passwordInputs.length).toBe(2);
  });

  it('login form submit meghívja a loginUser-t', () => {
    render(<Sign />);

    const emailInput = screen.getAllByPlaceholderText('Email')[1]; // login email
    const passwordInput = screen.getAllByPlaceholderText('Password')[1]; // login pw
    const loginButton = screen.getByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(loginButton);

    expect(Actions.loginUser).toHaveBeenCalledWith(dispatch, {
      email: 'test@example.com',
      password: '123456',
    });
  });

  it('register form submit meghívja a registerUser-t', () => {
    render(<Sign />);

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getAllByPlaceholderText('Email')[0]; // register email
    const passwordInput = screen.getAllByPlaceholderText('Password')[0]; // register pw
    const registerButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.change(usernameInput, { target: { value: 'TestUser' } });
    fireEvent.change(emailInput, { target: { value: 'reg@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'abcdef' } });
    fireEvent.click(registerButton);

    expect(Actions.registerUser).toHaveBeenCalledWith(dispatch, {
      username: 'TestUser',
      email: 'reg@example.com',
      password: 'abcdef',
    });
  });

  it('loading és error szövegek megjelennek', () => {
    vi.spyOn(GlobalContext, 'useGlobalContext').mockReturnValueOnce({
      state: { ...fullMockState, loading: true, error: 'Hiba történt' },
      dispatch,
    });

    render(<Sign />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Hiba történt')).toBeInTheDocument();
  });
});
