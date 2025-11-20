import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { quizActions } from "./quiz.actions";
import { map, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { tasksFeature } from "../tasks/tasks.reducer";
import { quizFeature } from "./quiz.reducer";
import { taskMatchesFilter } from "./quiz.functions";

import _ from 'lodash';

@Injectable() 
export class QuizEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  selectNextTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(quizActions.selectNextTask),
      withLatestFrom(
        this.store.select(tasksFeature.selectTasks), 
        this.store.select(quizFeature.selectQuizState)
      ),
      map(([payload, tasks, {displayedTask: activeTask, settings: quizFilter}]) => {
        const filtered = tasks.filter(task => 
          // Apply currently configured filter (if any)
          taskMatchesFilter(task, quizFilter) && 
          task !== activeTask   // Do not select the current task as "next" task by accident
        );

        const task = _.sample(filtered) ?? null;
        return quizActions.selectTask({task});
      })
    )
  );

};


