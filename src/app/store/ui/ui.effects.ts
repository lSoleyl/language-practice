import { DOCUMENT, inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { uiFeature } from "./ui.reducer";
import { uiActions } from "./ui.actions";
import { EMPTY, map, mergeMap, of, tap, withLatestFrom } from "rxjs";

@Injectable()
export class UIEffects {
  actions$ = inject(Actions);
  store = inject(Store);
  document = inject(DOCUMENT);


  saveState$ = createEffect(() => 
    this.actions$.pipe(
      ofType(uiActions.saveState),
      withLatestFrom(this.store.select(uiFeature.selectUiState)),
      tap(([_, state]) => {
        window.localStorage.setItem('ui-state', JSON.stringify(state));
      })
    ),
    {dispatch: false}
  );


  loadState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uiActions.loadSavedState),
      mergeMap(() => {
        const uiState = window.localStorage.getItem('ui-state');
        return uiState ? of(uiActions.setState({state: JSON.parse(uiState)})) : EMPTY;
      })
    )
  );

  // Save ui state on each theme change
  saveOnThemeChange$ = createEffect(() => 
    this.actions$.pipe(
      ofType(uiActions.setTheme, uiActions.toggleTheme),
      map(() => uiActions.saveState())
    )
  );


  constructor() {
    this.store.select(uiFeature.selectTheme).subscribe(theme => this.document.documentElement.setAttribute('data-theme', theme));
  }
};