import { render, screen } from '@testing-library/react';
import TasksView from '../../components/Views/TasksView';
import * as GlobalContext from '../../Context/GlobalContext';

describe('TasksView', () => {
  it('rendereli a TasksView-t', () => {
    vi.spyOn(GlobalContext, 'useGlobalContext').mockReturnValue({
      state: {
        user: null,
        token: 'fake-token',
        projects: [],
        tasks: [
          { _id: '1', title: 'Task 1', status: 'Open' },
          { _id: '2', title: 'Task 2', status: 'Done' },
        ],
        subtasks: [],
        loading: false,
        error: null,
        selectedProject: { _id: 'proj1', name: 'Teszt Projekt' },
        sprints: [],
        selectedSprint: null,
      },
      dispatch: vi.fn(),
    });

    render(<TasksView />);

    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('megjeleníti a "Select a project" üzenetet, ha nincs kiválasztott projekt', () => {
    vi.spyOn(GlobalContext, 'useGlobalContext').mockReturnValue({
      state: {
        user: null,
        token: 'fake-token',
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
    });

    render(<TasksView />);

    expect(screen.getByText('Select a project')).toBeInTheDocument();
  });
});
