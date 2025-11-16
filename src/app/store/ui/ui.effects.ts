import { DOCUMENT, inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { uiActions } from "./ui.actions";
import { EMPTY, mergeMap, of, withLatestFrom } from "rxjs";
import { uiFeature } from "./ui.reducer";

@Injectable()
export class UIEffects {
  actions$ = inject(Actions)
  store = inject(Store);
  document = inject(DOCUMENT);

  toggleTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uiActions.toggleTheme),
      withLatestFrom(this.store.select(uiFeature.selectTheme)),
      mergeMap(([_, theme]) => {
        const newTheme = (theme === 'light') ? 'dark' : 'light';
        this.document.documentElement.setAttribute("data-theme", newTheme);
        return of(uiActions.setTheme({theme: newTheme}));
      })
    )
  );


}