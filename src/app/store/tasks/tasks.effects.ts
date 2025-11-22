import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, type Action } from "@ngrx/store";
import { tasksActions } from "./tasks.actions";
import { tasksFeature } from "./tasks.reducer";
import { asyncScheduler, mergeMap, Subject, tap, throttleTime, withLatestFrom } from "rxjs";
import { pick } from "lodash";
import { HttpClient } from "@angular/common/http";
import type { PersistableTaskState } from "./tasks.state";

const PERSIST_THROTTLE_TIME = 300000; // save state at most once every 5 minutes to a file

@Injectable()
export class TasksEffects {
  actions$ = inject(Actions);
  store = inject(Store);
  httpClient = inject(HttpClient);

  /** Save the tasks to local storage
   */
  saveState$ = createEffect(() => 
    this.actions$.pipe(
      ofType(tasksActions.saveTask, tasksActions.deleteTask),
      withLatestFrom(this.store.select(tasksFeature.selectTasksState)),
      tap(([_, state]) => {
        let persistableState: PersistableTaskState = pick(state, "tasks", "nextTaskId")
        window.localStorage.setItem('tasks-state', JSON.stringify(persistableState));

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
        const result = new Subject<Action>();

        // First try to load the /tasks.json and only if that fails, fall back to localstorage
        this.httpClient.get('tasks.json', {responseType: 'json'}).subscribe({
          next: response => result.next(tasksActions.setLoadedTasksState({state: response as any})),
          error: error => {
            // No tasks.json -> try to load from 
            const localStorageState = window.localStorage.getItem('tasks-state');
            if (localStorageState) {
              result.next(tasksActions.setLoadedTasksState({state: JSON.parse(localStorageState)}));
            }
          }
        });

        return result;
      })
    )
  );

  /** Periodically save the current tasks to the server (if possible) to not lose the tasks once the browser cache is cleared
   */
  persistState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tasksActions.saveTask, tasksActions.deleteTask),
      // At most one PUT request every 5 minutes
      throttleTime(PERSIST_THROTTLE_TIME, asyncScheduler, {leading: true, trailing: true}),
      withLatestFrom(this.store.select(tasksFeature.selectTasksState)),
      tap(([_, state]) => {
        // Attempt to perfom an HTTP PUT request to save the tasks as tasks.json to keep the tasks in case the 
        // browser cache is cleared or something like this.
        let persistableState: PersistableTaskState = pick(state, "tasks", "nextTaskId");
        this.persistStateToServer(persistableState);
      })
    ),
    {dispatch: false}
  );

  private canPersistToServer = true;
  private persistStateToServer(state: PersistableTaskState) {
    if (this.canPersistToServer) {
      this.httpClient.put('tasks.json', JSON.stringify(state)).subscribe({
        // In case of an error response we cannot persist to the server, don't attempt it again
        error: () => this.canPersistToServer = false
      });
    }
  }
}