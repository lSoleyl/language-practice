import { createActionGroup, emptyProps, props } from "@ngrx/store";
import type { Task } from "../task.types";
import type { QuizSettings, QuizState, QuizStats } from "./quiz.state";


export interface SelectTaskPayload {
  task: Task | null;
};

export interface UpdateQuizSettingsPayload {
  settings: QuizSettings;
};

export interface UpdateQuizStatsPayload {
  stats: QuizStats;
}

export const quizActions = createActionGroup({
  source: 'Quiz',
  events: {
    'Select Task': props<SelectTaskPayload>(),
    'Select Next Task': emptyProps(),
    'Update Quiz Settings': props<UpdateQuizSettingsPayload>(),
    'Update Quiz Stats': props<UpdateQuizStatsPayload>(),
  }
});
