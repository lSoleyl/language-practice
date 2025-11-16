import { createFeature, createReducer, on } from "@ngrx/store";
import { initialState, type UIState } from "./ui.state";
import { uiActions, type SetStatePayload, type SetThemePayload } from "./ui.actions";

function _setTheme(state: UIState, {theme}: SetThemePayload) : UIState {
  return {
    ...state,
    theme
  };
}

function _toggleTheme(state: UIState) : UIState {
  return {
    ...state,
    theme: state.theme === 'light' ? 'dark' : 'light'
  };
}

function _setState(state: UIState, {state: newState} : SetStatePayload): UIState {
  return newState;
}



const uiReducer = createReducer(
  initialState,
  on(uiActions.setTheme, _setTheme),
  on(uiActions.toggleTheme, _toggleTheme),
  on(uiActions.setState, _setState)
);

export const uiFeature = createFeature({
  name: 'ui',
  reducer: uiReducer
});
