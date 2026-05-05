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
    sprints: [],
    selectedSprint: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(GlobalContext, 'useGlobalContext').mockReturnValue({
      state: { ...fullMockState },
      dispatch,
    });

    vi.spyOn(Actions, 'loginUser').mockImplementation(vi.fn());
    vi.spyOn(Actions, 'registerUser').mockImplementation(vi.fn());
  });

  it('rendereli a Sign komponenst alapértelmezetten login nézettel', () => {
    render(<Sign />);

    // Default tab is 'login' — the Sign in tab button is active
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('login form megjelenik alapértelmezetten', () => {
    render(<Sign />);

    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('regisztrációs form megjelenik Register fülre kattintva', () => {
    render(<Sign />);

    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByPlaceholderText('cooldev42')).toBeInTheDocument();
  });

  it('login form submit meghívja a loginUser-t', () => {
    render(<Sign />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    // Use exact text "Sign in →" to avoid matching the "Sign in" tab button
    const loginButton = screen.getByRole('button', { name: 'Sign in →' });

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

    // Switch to register tab
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    const usernameInput = screen.getByPlaceholderText('cooldev42');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const registerButton = screen.getByRole('button', { name: /create account/i });

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

  it('loading szöveg megjelenik', () => {
    vi.spyOn(GlobalContext, 'useGlobalContext').mockReturnValueOnce({
      state: { ...fullMockState, loading: true, error: null },
      dispatch,
    });

    render(<Sign />);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  });

  it('error szöveg megjelenik', () => {
    vi.spyOn(GlobalContext, 'useGlobalContext').mockReturnValueOnce({
      state: { ...fullMockState, loading: false, error: 'Hiba történt' },
      dispatch,
    });

    render(<Sign />);

    expect(screen.getByText('Hiba történt')).toBeInTheDocument();
  });
});
