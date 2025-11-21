import { createFeature, createReducer, on } from "@ngrx/store";
import { initialState, type QuizState } from "./quiz.state";
import { quizActions, type SelectTaskPayload, type UpdateQuizSettingsPayload, type UpdateQuizStatsPayload } from "./quiz.actions";


function _selectTask(state: QuizState, {task}: SelectTaskPayload): QuizState {
  return {
    ...state,
    displayedTask: task
  };
}


function _updateQuizSettings(state: QuizState, {settings}: UpdateQuizSettingsPayload): QuizState {
  return {
    ...state,
    settings: settings
  };
}

function _updateQuizStats(state: QuizState, {stats}: UpdateQuizStatsPayload): QuizState {
  return {
    ...state,
    stats: stats
  };
}


const quizReducer = createReducer(
  initialState,
  on(quizActions.selectTask, _selectTask),
  on(quizActions.updateQuizSettings, _updateQuizSettings),
  on(quizActions.updateQuizStats, _updateQuizStats)
);

export const quizFeature = createFeature({
  name: 'quiz',
  reducer: quizReducer
});
