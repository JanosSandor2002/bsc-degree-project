import React, { createContext, useReducer, useContext, type ReactNode } from 'react';
import { AppReducer, initialState } from './Reducer';

interface GlobalContextProps {
  state: typeof initialState;
  dispatch: React.Dispatch<any>;
}

const GlobalContext = createContext<GlobalContextProps>({
  state: initialState,
  dispatch: () => null,
});

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
