import { createActionGroup, emptyProps, props } from "@ngrx/store";

export interface TaskIdPayload {
  id: number;
}

export const tasksActions = createActionGroup({
  source: 'Task',
  events: {
    'Edit Task': props<TaskIdPayload>(),
    'Delete Task': props<TaskIdPayload>(),
    'Save Task': emptyProps(),
  }
});
