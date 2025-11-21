import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { tasksActions } from "./tasks.actions";
import { tasksFeature } from "./tasks.reducer";
import { EMPTY, mergeMap, of, tap, withLatestFrom } from "rxjs";
import { pick } from "lodash";

@Injectable()
export class TasksEffects {
  actions$ = inject(Actions);
  store = inject(Store);

  /** Save the tasks to local storage
   */
  saveState$ = createEffect(() => 
    this.actions$.pipe(
      ofType(tasksActions.saveTask, tasksActions.deleteTask),
      withLatestFrom(this.store.select(tasksFeature.selectTasksState)),
      tap(([_, state]) => {
        window.localStorage.setItem('tasks-state', JSON.stringify(pick(state, "tasks", "nextTaskId")));

        //TODO: perform a debounced HTTP PUT /tasks.json to save to the webserver if supported to not lose tasks if browser cache is cleared
      })
    ),
    {dispatch: false}
  );

  /** App requested loading the last saved tasks state from local storage
   */
  loadState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tasksActions.loadSavedState),
      mergeMap(() => {
        const state = window.localStorage.getItem('tasks-state');
        return state ? of(tasksActions.setLoadedTasksState({state: JSON.parse(state)})) : EMPTY;

        //TODO: if state is not set fallback to http request of tasks.json
      })
    )
  );
}