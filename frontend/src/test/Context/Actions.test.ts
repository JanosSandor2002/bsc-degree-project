import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import {
  fetchTasks,
  addTask,
  fetchSubtasks,
  addSubtask,
  fetchProjects,
  addProject,
} from '../../Context/Actions';

vi.mock('axios');

describe('Actions', () => {
  const dispatch = vi.fn();
  const token = 'fake-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // fetchTasks

  it('fetchTasks dispatch-olja a SET_TASKS-t', async () => {
    const fakeTasks = [
      { _id: '1', title: 'Task 1', status: 'Open' },
      { _id: '2', title: 'Task 2', status: 'Done' },
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

  it('fetchTasks hibát is dispatch-ol SET_ERROR-rel', async () => {
    const error = new Error('API hiba');
    (axios.get as any).mockRejectedValue(error);

    await fetchTasks(dispatch, token, 'proj1');

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_ERROR',
      payload: 'API hiba',
    });
  });

  //addTask

  it('addTask dispatch-olja az ADD_TASK-t', async () => {
    const newTask = { title: 'New Task', status: 'Open' };
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

  it('addTask hibát dispatch-ol SET_ERROR-rel', async () => {
    const error = new Error('Post hiba');
    (axios.post as any).mockRejectedValue(error);

    await addTask(dispatch, token, { title: 'x' });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_ERROR',
      payload: 'Post hiba',
    });
  });

  //fetchSubtasks

  it('fetchSubtasks dispatch-olja az APPEND_SUBTASKS-t', async () => {
    const fakeSubs = [{ _id: 'a', title: 'Sub 1', task: 'task1' }];
    (axios.get as any).mockResolvedValue({ data: fakeSubs });

    await fetchSubtasks(dispatch, token, 'task1');

    expect(dispatch).toHaveBeenCalledWith({
      type: 'APPEND_SUBTASKS',
      payload: fakeSubs,
    });
  });

  //addSubtask

  it('addSubtask dispatch-olja az ADD_SUBTASK-t', async () => {
    const newSub = { title: 'Sub', task: 'task1' };
    const returned = { ...newSub, _id: 'sub1' };
    (axios.post as any).mockResolvedValue({ data: returned });

    await addSubtask(dispatch, token, newSub);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ADD_SUBTASK',
      payload: returned,
    });
  });

  //fetchProjects

  it('fetchProjects dispatch-olja a SET_PROJECTS-t', async () => {
    const fakeProjects = [{ _id: 'p1', name: 'Projekt 1' }];
    (axios.get as any).mockResolvedValue({ data: fakeProjects });

    await fetchProjects(dispatch, token);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_PROJECTS',
      payload: fakeProjects,
    });
  });

  //addProject

  it('addProject dispatch-olja az ADD_PROJECT-t', async () => {
    const newProj = { name: 'Új Projekt' };
    const returned = { ...newProj, _id: 'p2' };
    (axios.post as any).mockResolvedValue({ data: returned });

    await addProject(dispatch, token, newProj);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ADD_PROJECT',
      payload: returned,
    });
  });
});
