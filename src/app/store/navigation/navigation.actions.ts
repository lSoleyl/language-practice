import { createActionGroup, props } from "@ngrx/store";
import type { NavigationEntry } from "./navigation.state";

export type RegisterViewPayload = NavigationEntry;

export interface SelectViewPayload {
  id: string
};


export const navigationActions = createActionGroup({
  source: 'Navigation',
  events: {
    'Register View': props<RegisterViewPayload>(),
    'Select View': props<SelectViewPayload>(),
  }
});
