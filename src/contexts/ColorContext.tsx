import React, { useReducer, createContext, ReactNode, Dispatch } from 'react';
import { ColorReducer, ColorAction, ColorState } from '../hooks/ColorReducer';

const INITIAL_STATE: ColorState = {
  darkMode: false,
};

interface ColorContextProps {
  darkMode: boolean;
  dispatch: Dispatch<ColorAction>;
}
interface ColorContextProviderProps {
  children: ReactNode;
}

export const ColorContext = createContext<ColorContextProps>({
  darkMode: INITIAL_STATE.darkMode,
  dispatch: () => null,
});



export const ColorContextProvider: React.FC<ColorContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(ColorReducer, INITIAL_STATE);

  return (
    <ColorContext.Provider
      value={{
        darkMode: state.darkMode,
        dispatch,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};
