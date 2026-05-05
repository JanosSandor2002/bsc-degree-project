import { AppReducer, initialState } from '../../Context/Reducer';

describe('AppReducer', () => {
  it('SET_SUBTASKS akció frissíti a subtasks mezőt', () => {
    const subtasks = [
      { _id: 'a', title: 'Subtask A', status: 'Open' },
      { _id: 'b', title: 'Subtask B', status: 'Done' },
    ];

    const newState = AppReducer(initialState, {
      type: 'SET_SUBTASKS',
      payload: subtasks,
    });

    expect(newState.subtasks).toEqual(subtasks);
  });

  it('SET_LOADING akció frissíti a loading mezőt', () => {
    const newState = AppReducer(initialState, {
      type: 'SET_LOADING',
      payload: true,
    });

    expect(newState.loading).toBe(true);
  });

  it('SET_SELECTED_PROJECT akció frissíti a selectedProject mezőt', () => {
    const project = { _id: 'proj1', name: 'Project 1' };

    const newState = AppReducer(initialState, {
      type: 'SET_SELECTED_PROJECT',
      payload: project,
    });

    expect(newState.selectedProject).toEqual(project);
  });

  it('SET_USER akció frissíti a user és token mezőt', () => {
    const newState = AppReducer(initialState, {
      type: 'SET_USER',
      payload: { user: { username: 'Alice' }, token: 'tok123' },
    });

    expect(newState.user).toEqual({ username: 'Alice' });
    expect(newState.token).toBe('tok123');
  });

  it('LOGOUT törli a user és token mezőt', () => {
    const loggedIn = { ...initialState, user: { username: 'Alice' }, token: 'tok' };
    const newState = AppReducer(loggedIn, { type: 'LOGOUT' });

    expect(newState.user).toBeNull();
    expect(newState.token).toBeNull();
  });

  it('ADD_TASK hozzáad egy taskot a listához', () => {
    const task = { _id: 't1', title: 'Új task' };
    const newState = AppReducer(initialState, { type: 'ADD_TASK', payload: task });

    expect(newState.tasks).toContainEqual(task);
  });

  it('DELETE_TASK eltávolítja a taskot ID alapján', () => {
    const withTask = { ...initialState, tasks: [{ _id: 't1', title: 'Task' }] };
    const newState = AppReducer(withTask, { type: 'DELETE_TASK', payload: 't1' });

    expect(newState.tasks).toHaveLength(0);
  });

  it('ADD_SPRINT hozzáad egy sprintet', () => {
    const sprint = { _id: 's1', name: 'Sprint 1' };
    const newState = AppReducer(initialState, { type: 'ADD_SPRINT', payload: sprint });

    expect(newState.sprints).toContainEqual(sprint);
  });

  it('DELETE_SPRINT eltávolítja a sprintet', () => {
    const withSprint = { ...initialState, sprints: [{ _id: 's1', name: 'Sprint 1' }] };
    const newState = AppReducer(withSprint, { type: 'DELETE_SPRINT', payload: 's1' });

    expect(newState.sprints).toHaveLength(0);
  });

  it('APPEND_SUBTASKS hozzáfűzi az új subtaskokat', () => {
    const existing = [{ _id: 'a', title: 'Régi', task: 'task1' }];
    const incoming = [{ _id: 'b', title: 'Új', task: 'task2' }];
    const withSubs = { ...initialState, subtasks: existing };

    const newState = AppReducer(withSubs, { type: 'APPEND_SUBTASKS', payload: incoming });

    expect(newState.subtasks).toHaveLength(2);
  });
});
