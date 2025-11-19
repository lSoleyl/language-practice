import { createActionGroup, emptyProps, props } from "@ngrx/store";
import type { Task, TaskType } from "../task.types";

export interface TaskIdPayload {
  id: number;
}

export interface UpdateEditedTaskPayload {
  task: Task;
}

export interface ChangeTaskTypePayload {
  taskType: TaskType;
}

export const tasksActions = createActionGroup({
  source: 'Task',
  events: {
    'Edit Task': props<TaskIdPayload>(),

    /** This action is used while changing properties of the currently edited task.
     */
    'Update Edited Task': props<UpdateEditedTaskPayload>(),

    /** Used to change the type of the current task while preserving the main content by transferring it to the new task
     *  and filtering out unneeded properties.
     */
    'Change Task Type': props<ChangeTaskTypePayload>(),

    /** Create a new task for editing
     */
    'Create New Task': emptyProps(),

    /** Cancel edit of currently edited task
     */
    'Cancel Edit': emptyProps(),
    'Delete Task': props<TaskIdPayload>(),

    /** Save the currently edited overwriting the previous version in state.tasks and clearing the currently edited task
     */
    'Save Task': emptyProps(),
  }
});
