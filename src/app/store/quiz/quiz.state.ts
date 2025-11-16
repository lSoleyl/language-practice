import type { Task } from "../task.types";


export interface QuizState {
  displayedTask: Task | undefined;
}


export const initialState: QuizState = {
  displayedTask: undefined
};
