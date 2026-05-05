import { render, screen } from '@testing-library/react';
import SubTasksView from '../../components/Views/SubTasksView';
import * as GlobalContext from '../../Context/GlobalContext';

describe('SubTasksView', () => {
  it('rendereli a SubTasksView-t', () => {
    vi.spyOn(GlobalContext, 'useGlobalContext').mockReturnValue({
      state: {
        user: null,
        token: 'fake-token',
        projects: [],
        tasks: [
          { _id: '1', title: 'Task 1', status: 'Open' },
          { _id: '2', title: 'Task 2', status: 'Done' },
        ],
        subtasks: [
          { _id: 'a', title: 'Subtask A', status: 'Open', task: '1' },
          { _id: 'b', title: 'Subtask B', status: 'Done', task: '2' },
        ],
        loading: false,
        error: null,
        selectedProject: { _id: 'proj1', name: 'Teszt Projekt' },
        sprints: [],
        selectedSprint: null,
      },
      dispatch: vi.fn(),
    });

    render(<SubTasksView />);

    expect(screen.getByText('Subtasks')).toBeInTheDocument();
    expect(screen.getByText('Subtask A')).toBeInTheDocument();
    expect(screen.getByText('Subtask B')).toBeInTheDocument();
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

    render(<SubTasksView />);

    expect(screen.getByText('Select a project in the top bar.')).toBeInTheDocument();
  });
});
