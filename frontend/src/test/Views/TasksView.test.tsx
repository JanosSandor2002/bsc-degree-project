import { render, screen } from '@testing-library/react';
import TasksView from '../../components/Views/TasksView';
import * as GlobalContext from '../../Context/GlobalContext'; // importáljuk *-ként

describe('TasksView', () => {
  it('rendereli a TasksView-t', () => {
    // Mockoljuk a useGlobalContext-et
    vi.spyOn(GlobalContext, 'useGlobalContext').mockReturnValue({
      state: {
        user: null,
        token: 'fake-token', // így jó
        projects: [],
        tasks: [
          { _id: '1', title: 'Task 1', status: 'open' },
          { _id: '2', title: 'Task 2', status: 'done' },
        ],
        subtasks: [],
        loading: false,
        error: null,
        selectedProject: { _id: 'proj1' },
      },
      dispatch: vi.fn(),
    });

    render(<TasksView />);

    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});
