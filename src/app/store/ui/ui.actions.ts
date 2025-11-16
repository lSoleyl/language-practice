import { createActionGroup, props } from "@ngrx/store";
import { UIState } from "./ui.state";


export interface SetThemePayload {
  theme: UIState['theme']
};


export const uiActions = createActionGroup({
  source: 'UI',
  events: {
    'Toggle Theme': props<any>(),
    'Set Theme': props<SetThemePayload>()
  }
});
