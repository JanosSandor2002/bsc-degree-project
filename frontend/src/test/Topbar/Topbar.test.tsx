import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Topbar from '../../components/Topbar/Topbar';

vi.mock('../../Context/ViewContext', () => ({
  useViewContext: () => ({
    activeView: 'main',
    dispatch: vi.fn(),
  }),
}));

vi.mock('../../Context/GlobalContext', () => ({
  useGlobalContext: () => ({
    state: {
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
    },
    dispatch: vi.fn(),
  }),
}));

describe('Topbar', () => {
  it('rendereli a topbart', () => {
    render(<Topbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('rendereli a navigációs gombokat', () => {
    render(<Topbar />);
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('SubTasks')).toBeInTheDocument();
    expect(screen.getByText('Log')).toBeInTheDocument();
  });

  it('rendereli a User menü gombot', () => {
    render(<Topbar />);
    expect(screen.getByText('User')).toBeInTheDocument();
  });
});
