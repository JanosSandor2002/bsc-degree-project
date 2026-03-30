import { render, screen } from '@testing-library/react';
import SubTasksView from '../../components/Views/SubTasksView';
import * as GlobalContext from '../../Context/GlobalContext'; // importáljuk *-ként

describe('SubTasksView', () => {
  it('rendereli a SubTasksView-t', () => {
    // Mockoljuk a useGlobalContext-et
    vi.spyOn(GlobalContext, 'useGlobalContext').mockReturnValue({
      state: {
        user: null,
        token: 'fake-token',
        projects: [],
        tasks: [
          { _id: '1', title: 'Task 1', status: 'open' },
          { _id: '2', title: 'Task 2', status: 'done' },
        ],
        subtasks: [
          { _id: 'a', title: 'Subtask A', status: 'pending' },
          { _id: 'b', title: 'Subtask B', status: 'completed' },
        ],
        loading: false,
        error: null,
        selectedProject: { _id: 'proj1' },
      },
      dispatch: vi.fn(),
    });

    render(<SubTasksView />);

    expect(screen.getByText('Subtasks')).toBeInTheDocument();
    expect(screen.getByText('Subtask A')).toBeInTheDocument();
    expect(screen.getByText('Subtask B')).toBeInTheDocument();
  });
});
