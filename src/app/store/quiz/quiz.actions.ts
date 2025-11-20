import { createActionGroup, emptyProps, props } from "@ngrx/store";
import type { Task } from "../task.types";
import type { QuizSettings } from "./quiz.state";


export interface SelectTaskPayload {
  task: Task | null
};

export interface UpdateQuizSettingsPayload {
  settings: QuizSettings
};

export const quizActions = createActionGroup({
  source: 'Quiz',
  events: {
    'Select Task': props<SelectTaskPayload>(),
    'Select Next Task': emptyProps(),
    'Update Quiz Settings': props<UpdateQuizSettingsPayload>()
  }
});
