import { createFeature, createReducer, on } from "@ngrx/store";
import { initialState, type NavigationState } from "./navigation.state";
import { navigationActions, type RegisterViewPayload, type SelectViewPayload } from "./navigation.actions";



function _registerView(state: NavigationState, payload: RegisterViewPayload) : NavigationState {
  state = {
    ...state,
    views: [
      ...state.views,
      payload
    ]
  };

  if (!state.activeView) {
    state = {
      ...state,
      activeView: payload.id
    };
  }

  return state;
}


function _selectView(state: NavigationState, payload: SelectViewPayload) : NavigationState {
  return {
    ...state,
    activeView: payload.id
  };
}



const navigationReducer = createReducer(
  initialState,
  on(navigationActions.registerView, _registerView),
  on(navigationActions.selectView, _selectView)
);

export const navigationFeature = createFeature({
  name: 'navigation',
  reducer: navigationReducer
});
