import { createFeature, createReducer, on } from "@ngrx/store";
import { initialState, type TasksState } from "./tasks.state";
import { tasksActions, type TaskIdPayload } from "./tasks.actions";
import _ from "lodash";


function _editTask(state: TasksState, {id}: TaskIdPayload): TasksState {
  return {
    ...state,
    currentlyEditedTask: state.tasks.find(task => task.id === id) ?? null
  };
}


function _deleteTask(state: TasksState, {id}: TaskIdPayload): TasksState {
  if (state.tasks.find(task => task.id === id)) {
    state = {
      tasks: state.tasks
        .filter(task => task.id !== id)
        .map(task => task.id > id ? {...task, id: task.id-1} : task),
        
      nextTaskId: state.nextTaskId-1,

      currentlyEditedTask: (state.currentlyEditedTask?.id === id) ? null : state.currentlyEditedTask
    };
  }

  return state;
}

function _saveTask(state: TasksState): TasksState {
  if (state.currentlyEditedTask) {
    state = {
      ...state, 
      tasks: _.sortBy([
        ...state.tasks.filter(task => task.id !== state.currentlyEditedTask!.id),
        state.currentlyEditedTask
      ], state => state.id),
      currentlyEditedTask: null
    }
  }

  return state;
}



const tasksReducer = createReducer(
  initialState,
  on(tasksActions.editTask, _editTask),
  on(tasksActions.deleteTask, _deleteTask),
  on(tasksActions.saveTask, _saveTask),
);

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: tasksReducer
});

