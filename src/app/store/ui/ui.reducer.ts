import { createFeature, createReducer, on } from "@ngrx/store";
import { initialState, type UIState } from "./ui.state";
import { uiActions, type SetThemePayload } from "./ui.actions";


function _setTheme(state: UIState, {theme}: SetThemePayload) : UIState {
  return {
    ...state,
    theme
  };
}


const uiReducer = createReducer(
  initialState,
  on(uiActions.setTheme, _setTheme)
);

export const uiFeature = createFeature({
  name: 'ui',
  reducer: uiReducer
});
