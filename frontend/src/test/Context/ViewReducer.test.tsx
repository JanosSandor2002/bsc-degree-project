import {
  ViewReducer,
  initialViewState,
  type ViewAction,
  type ViewState,
} from '../../Context/ViewReducer';

describe('ViewReducer', () => {
  it('alapértelmezett state visszaadása ismeretlen akcióval', () => {
    const unknownAction = {
      type: 'UNKNOWN',
      payload: 'tasks',
    } as unknown as ViewAction;
    const newState = ViewReducer(initialViewState, unknownAction);
    expect(newState).toBe(initialViewState);
  });

  it('SET_VIEW akció frissíti az activeView-t', () => {
    const action: ViewAction = { type: 'SET_VIEW', payload: 'tasks' };
    const newState = ViewReducer(initialViewState, action);
    expect(newState).toBe('tasks');
  });

  it('többféle ViewState-et is kezel', () => {
    const states: ViewState[] = ['main', 'kanban', 'scrum', 'subtasks', 'log'];
    states.forEach((state) => {
      const newState = ViewReducer(initialViewState, {
        type: 'SET_VIEW',
        payload: state,
      });
      expect(newState).toBe(state);
    });
  });
});
