export interface ColorState {
    darkMode: boolean;
  }
  
  export type ColorAction =
    | { type: 'LIGHT' }
    | { type: 'DARK' }
    | { type: 'TOGGLE' };
  
  export const ColorReducer = (state: ColorState, action: ColorAction): ColorState => {
    switch (action.type) {
      case 'LIGHT':
        return {
          darkMode: false,
        };
      case 'DARK':
        return {
          darkMode: true,
        };
      case 'TOGGLE':
        return {
          darkMode: !state.darkMode,
        };
      default:
        return state;
    }
  };
  