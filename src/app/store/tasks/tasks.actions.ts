import { createActionGroup, emptyProps, props } from "@ngrx/store";
import type { Task } from "../task.types";

export interface TaskIdPayload {
  id: number;
}

export interface UpdateEditedTaskPayload {
  task: Task;
}

export const tasksActions = createActionGroup({
  source: 'Task',
  events: {
    'Edit Task': props<TaskIdPayload>(),

    /** This action is used while changing properties of the currently edited task.
     */
    'Update Edited Task': props<UpdateEditedTaskPayload>(),

    /** Cancel edit of currently edited task
     */
    'Cancel Edit': emptyProps(),
    'Delete Task': props<TaskIdPayload>(),

    /** Save the currently edited overwriting the previous version in state.tasks and clearing the currently edited task
     */
    'Save Task': emptyProps(),
  }
});
