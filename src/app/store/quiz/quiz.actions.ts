import { createActionGroup, props } from "@ngrx/store";
import type { Task } from "../task.types";


export interface SelectTaskPayload {
  task: Task
};


export interface SelectRandomTaskPayload {
  category?: string; // optional category filter
  taskType?: string; // optional type filter
};

export const quizActions = createActionGroup({
  source: 'Quiz',
  events: {
    'Select Task': props<SelectTaskPayload>(),
    'Select Random Task': props<SelectRandomTaskPayload>()
  }
});
