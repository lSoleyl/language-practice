import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { quizActions } from "./quiz.actions";
import { EMPTY, mergeMap, of, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { tasksFeature } from "../tasks/tasks.reducer";

import _ from 'lodash';

@Injectable() 
export class QuizEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  selectRandomTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(quizActions.selectRandomTask),
      withLatestFrom(this.store.select(tasksFeature.selectTasks)),
      mergeMap(([payload, tasks]) => {
        //TODO: get all tasks and select a random one using the provided filter
        const task = _.sample(tasks.filter(task => (!payload.category || task.category === payload.category) && (!payload.taskType || task.type === payload.taskType)));
        return task ? of(quizActions.selectTask({task})) : EMPTY;
      })
    )
  );

};


