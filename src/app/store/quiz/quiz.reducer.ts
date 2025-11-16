import { createFeature, createReducer, on } from "@ngrx/store";
import { initialState, type QuizState } from "./quiz.state";
import { quizActions, type SelectTaskPayload } from "./quiz.actions";


function _selectTask(state: QuizState, {task}: SelectTaskPayload): QuizState {
  return {
    ...state,
    displayedTask: task
  };
}


const quizReducer = createReducer(
  initialState,
  on(quizActions.selectTask, _selectTask)
);

export const quizFeature = createFeature({
  name: 'quiz',
  reducer: quizReducer
});
