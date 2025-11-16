import { createFeature, createReducer } from "@ngrx/store";
import { initialState } from "./tasks.state";


const tasksReducer = createReducer(
  initialState
);

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: tasksReducer
});

