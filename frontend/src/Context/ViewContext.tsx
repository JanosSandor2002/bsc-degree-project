import { createContext, useReducer, type ReactNode, useContext } from 'react';
import {
  ViewReducer,
  initialViewState,
  type ViewContextType,
  type ViewAction,
} from './ViewReducer';

const ViewContext = createContext<ViewContextType>({
  activeView: initialViewState,
  dispatch: () => null,
});

export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [activeView, dispatch] = useReducer(ViewReducer, initialViewState);

  return (
    <ViewContext.Provider value={{ activeView, dispatch }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useViewContext = () => useContext(ViewContext);
