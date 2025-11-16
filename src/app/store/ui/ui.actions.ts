import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { UIState } from "./ui.state";


export interface SetThemePayload {
  theme: UIState['theme']
};

export interface SetStatePayload {
  state: UIState
};


export const uiActions = createActionGroup({
  source: 'UI',
  events: {
    'Toggle Theme': emptyProps(),
    'Set Theme': props<SetThemePayload>(),
    'Save State': emptyProps(),
    'Load Saved State': emptyProps(),
    'Set State': props<SetStatePayload>()
  }
});
