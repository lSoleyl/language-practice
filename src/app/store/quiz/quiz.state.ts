import { ALL_TASK_CATEGORIES, ALL_TASK_TYPES, type Task, type TaskCategory, type TaskType } from "../task.types";


export interface QuizSettings {
  
  /** Array of all allowed task categores
   *  An empty array will be treated just like an array of all categories
   */
  categories: TaskCategory[];

  /** Array of all allowed task types. 
   *  An empty array will be treated just like an array of all types
   */
  types: TaskType[];
}


export interface QuizState {
  /** The currently displayed quiz task
   */
  displayedTask: Task | null;
  
  /** The configured settings for the quiz session
   */
  settings: QuizSettings;

  //TODO: add stats of quiz so far
}


export const initialState: QuizState = {
  displayedTask: null,
  settings: {
    categories: ALL_TASK_CATEGORIES,
    types: ALL_TASK_TYPES
  }
};
