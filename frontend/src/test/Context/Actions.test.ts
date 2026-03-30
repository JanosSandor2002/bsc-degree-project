import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { fetchTasks, addTask } from '../../Context/Actions';

vi.mock('axios');

describe('Actions', () => {
  const dispatch = vi.fn();
  const token = 'fake-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchTasks dispatch-olja a SET_TASKS-t', async () => {
    const fakeTasks = [
      { _id: '1', title: 'Task 1', status: 'open' },
      { _id: '2', title: 'Task 2', status: 'done' },
    ];

    (axios.get as any).mockResolvedValue({ data: fakeTasks });

    await fetchTasks(dispatch, token, 'proj1');

    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:5000/api/tasks/project/proj1',
      { headers: { Authorization: `Bearer ${token}` } },
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_TASKS',
      payload: fakeTasks,
    });
  });

  it('addTask dispatch-olja az ADD_TASK-t', async () => {
    const newTask = { title: 'New Task', status: 'open' };
    const returnedTask = { ...newTask, _id: '3' };

    (axios.post as any).mockResolvedValue({ data: returnedTask });

    await addTask(dispatch, token, newTask);

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/api/tasks',
      newTask,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ADD_TASK',
      payload: returnedTask,
    });
  });

  it('fetchTasks hibát is dispatch-ol SET_ERROR-rel', async () => {
    const error = new Error('API hiba');
    (axios.get as any).mockRejectedValue(error);

    await fetchTasks(dispatch, token, 'proj1');

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_ERROR',
      payload: 'API hiba',
    });
  });
});
