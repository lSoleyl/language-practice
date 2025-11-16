import type { Task } from "../task.types";


export interface QuizState {
  displayedTask: Task | null;
}


export const initialState: QuizState = {
  displayedTask: null
};
