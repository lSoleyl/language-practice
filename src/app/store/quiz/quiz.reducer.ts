import { createFeature, createReducer, on } from "@ngrx/store";
import { initialState, type QuizState } from "./quiz.state";
import { quizActions, type SelectTaskPayload, type UpdateQuizSettingsPayload } from "./quiz.actions";


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


const quizReducer = createReducer(
  initialState,
  on(quizActions.selectTask, _selectTask),
  on(quizActions.updateQuizSettings, _updateQuizSettings)
);

export const quizFeature = createFeature({
  name: 'quiz',
  reducer: quizReducer
});
