import { AppReducer, initialState } from '../../Context/Reducer';

describe('AppReducer', () => {
  it('SET_SUBTASKS akció frissíti a subtasks mezőt', () => {
    const subtasks = [
      { _id: 'a', title: 'Subtask A', status: 'pending' },
      { _id: 'b', title: 'Subtask B', status: 'done' },
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
});
