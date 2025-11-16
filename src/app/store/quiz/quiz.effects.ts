import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { quizActions } from "./quiz.actions";
import { map, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { tasksFeature } from "../tasks/tasks.reducer";

import _ from 'lodash';
import { quizFeature } from "./quiz.reducer";

@Injectable() 
export class QuizEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  selectRandomTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(quizActions.selectRandomTask),
      withLatestFrom(this.store.select(tasksFeature.selectTasks), this.store.select(quizFeature.selectDisplayedTask)),
      map(([payload, tasks, activeTask]) => {
        const filtered = tasks.filter(task => 
          (!payload.category || task.category === payload.category) && 
          (!payload.taskType || task.type === payload.taskType) && 
          task !== activeTask   // To not select the current task as "next" task by accident
        );

        const task = _.sample(filtered) ?? null;
        return quizActions.selectTask({task});
      })
    )
  );

};


