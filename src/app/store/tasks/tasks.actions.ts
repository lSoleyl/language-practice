import { createActionGroup, props } from "@ngrx/store";

export interface TaskIdPayload {
  id: number;
}

export const tasksActions = createActionGroup({
  source: 'Task',
  events: {
    'Delete Task': props<TaskIdPayload>()
  }
});
