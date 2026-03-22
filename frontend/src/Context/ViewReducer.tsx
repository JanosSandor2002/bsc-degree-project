import type { Dispatch } from 'react';

export type ViewState =
  | 'main'
  | 'kanban'
  | 'scrum'
  | 'gamification'
  | 'wiki'
  | 'plan'
  | 'tasks'
  | 'subtasks'
  | 'log'
  | 'account'
  | 'create'
  | 'mails'
  | 'sign'
  | 'quit';

export interface ViewContextType {
  activeView: ViewState;
  dispatch: Dispatch<ViewAction>;
}

export type ViewAction = { type: 'SET_VIEW'; payload: ViewState };

export const initialViewState: ViewState = 'main';

export const ViewReducer = (
  state: ViewState,
  action: ViewAction,
): ViewState => {
  switch (action.type) {
    case 'SET_VIEW':
      return action.payload;
    default:
      return state;
  }
};
