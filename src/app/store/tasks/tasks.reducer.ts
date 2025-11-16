import { createFeature, createReducer, on } from "@ngrx/store";
import { initialState, type TasksState } from "./tasks.state";
import { tasksActions, type TaskIdPayload } from "./tasks.actions";


function _deleteTask(state: TasksState, {id}: TaskIdPayload): TasksState {
  if (state.tasks.find(task => task.id === id)) {
    // When deleting a task also decrement the next task id and decrement task ids of tasks following the deleted element
    // FIXME: if we are going through this effort, then we could also just use the task index as task id...
    state = {
      tasks: state.tasks
        .filter(task => task.id !== id)
        .map(task => task.id > id ? {...task, id: task.id-1} : task),
        
      nextTaskId: state.nextTaskId-1
    };
  }

  return state;
}


const tasksReducer = createReducer(
  initialState,
  on(tasksActions.deleteTask, _deleteTask)
);

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: tasksReducer
});

