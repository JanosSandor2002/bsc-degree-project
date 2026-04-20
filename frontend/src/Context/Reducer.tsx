export const initialState = {
  user: null as any | null,
  token: null as string | null,
  projects: [] as any[],
  tasks: [] as any[],
  subtasks: [] as any[],
  loading: false,
  error: null as string | null,
  selectedProject: null as any | null,
  sprints: [] as any[],
  selectedSprint: null as any | null,
};

type Action =
  | { type: 'SET_USER'; payload: any }
  | { type: 'LOGOUT' }
  | { type: 'SET_PROJECTS'; payload: any[] }
  | { type: 'ADD_PROJECT'; payload: any }
  | { type: 'UPDATE_PROJECT'; payload: any }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_TASKS'; payload: any[] }
  | { type: 'ADD_TASK'; payload: any }
  | { type: 'UPDATE_TASK'; payload: any }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_SUBTASKS'; payload: any[] }
  | { type: 'APPEND_SUBTASKS'; payload: any[] }
  | { type: 'ADD_SUBTASK'; payload: any }
  | { type: 'UPDATE_SUBTASK'; payload: any }
  | { type: 'DELETE_SUBTASK'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SELECTED_PROJECT'; payload: any }
  | { type: 'SET_SPRINTS'; payload: any[] }
  | { type: 'SET_SELECTED_SPRINT'; payload: any }
  | { type: 'ADD_SPRINT'; payload: any }
  | { type: 'DELETE_SPRINT'; payload: string }
  | { type: 'UPDATE_USER'; payload: any };

export const AppReducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return { ...state, user: null, token: null };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p._id === action.payload._id ? action.payload : p,
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p._id !== action.payload),
      };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t._id === action.payload._id ? action.payload : t,
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      };
    case 'SET_SUBTASKS':
      return { ...state, subtasks: action.payload };
    // APPEND merges new subtasks without wiping existing ones from other tasks
    case 'APPEND_SUBTASKS': {
      const incoming = action.payload as any[];
      if (incoming.length === 0) return state;
      const taskId = incoming[0].task?._id ?? incoming[0].task;
      // Remove any old subtasks belonging to this task, then add the fresh ones
      const filtered = state.subtasks.filter((s: any) => {
        const sTaskId = typeof s.task === 'string' ? s.task : s.task?._id;
        return sTaskId !== taskId;
      });
      return { ...state, subtasks: [...filtered, ...incoming] };
    }
    case 'ADD_SUBTASK':
      return { ...state, subtasks: [...state.subtasks, action.payload] };
    case 'UPDATE_SUBTASK':
      return {
        ...state,
        subtasks: state.subtasks.map((s) =>
          s._id === action.payload._id ? action.payload : s,
        ),
      };
    case 'DELETE_SUBTASK':
      return {
        ...state,
        subtasks: state.subtasks.filter((s) => s._id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SELECTED_PROJECT':
      return { ...state, selectedProject: action.payload };
    case 'SET_SPRINTS':
      return { ...state, sprints: action.payload };
    case 'SET_SELECTED_SPRINT':
      return { ...state, selectedSprint: action.payload };
    case 'ADD_SPRINT':
      return { ...state, sprints: [...state.sprints, action.payload] };
    case 'DELETE_SPRINT':
      return {
        ...state,
        sprints: state.sprints.filter((s) => s._id !== action.payload),
      };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};
