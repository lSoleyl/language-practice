import { createSelector } from "@ngrx/store";
import { navigationFeature } from "./navigation.reducer";
import type { NavigationState } from "./navigation.state";


export const selectActiveView = navigationFeature.selectActiveView;

export const selectViews = createSelector(
  navigationFeature.selectNavigationState,
  ({views, activeView}: NavigationState) => views.map(view => ({...view, active: view.id === activeView}))
)
