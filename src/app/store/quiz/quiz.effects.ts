import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { quizActions } from "./quiz.actions";
import { map, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { tasksFeature } from "../tasks/tasks.reducer";
import { quizFeature } from "./quiz.reducer";
import type { QuizSettings } from "./quiz.state";
import type { Task } from "../task.types";

import _ from 'lodash';

@Injectable() 
export class QuizEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);


  private taskMatchesFilter(task: Task, settings: QuizSettings) {
    if (settings.types.length && !settings.types.includes(task.type)) {
      return false;
    }

    if (settings.categories.length && !settings.categories.includes(task.category)) {
      return false;
    }

    return true;
  }


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
          this.taskMatchesFilter(task, quizFilter) && 
          task !== activeTask   // Do not select the current task as "next" task by accident
        );

        const task = _.sample(filtered) ?? null;
        return quizActions.selectTask({task});
      })
    )
  );

};


