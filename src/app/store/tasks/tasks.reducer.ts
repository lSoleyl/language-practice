import { createFeature, createReducer, on } from "@ngrx/store";
import { initialState, type TasksState } from "./tasks.state";
import { tasksActions, type TaskIdPayload, type UpdateEditedTaskPayload } from "./tasks.actions";
import { TaskCategory, TaskType } from "../task.types";
import _ from "lodash";


function _editTask(state: TasksState, {id}: TaskIdPayload): TasksState {
  return {
    ...state,
    currentlyEditedTask: state.tasks.find(task => task.id === id) ?? null
  };
}


function _cancelEdit(state: TasksState) : TasksState {
  return {
    ...state,
    currentlyEditedTask: null
  };
}


function _updateEditedTask(state: TasksState, {task}: UpdateEditedTaskPayload): TasksState {
  return {
    ...state,
    currentlyEditedTask: task
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
  } else if (state.currentlyEditedTask?.id === id) {
    // This is a newly created task we are trying to delete -> simply clear the currently edited task
    state = {
      ...state,
      currentlyEditedTask: null
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
        {
          // Update the modified timestamp of the edited task
          ...state.currentlyEditedTask,
          lastModified: new Date().toISOString()
        }
      ], state => state.id),
      currentlyEditedTask: null,

      // Increment the task id in case we created a new task
      nextTaskId: state.currentlyEditedTask!.id === state.nextTaskId ? state.nextTaskId+1 : state.nextTaskId
    }
  }

  return state;
}


function _createNewTask(state: TasksState): TasksState {
  return {
    ...state, 
    currentlyEditedTask: {
      // define the default task here
      id: state.nextTaskId,
      type: TaskType.GAP_TEXT,
      category: TaskCategory.GRAMMAR,
      elements: [],
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
  }
}


const tasksReducer = createReducer(
  initialState,
  on(tasksActions.editTask, _editTask),
  on(tasksActions.deleteTask, _deleteTask),
  on(tasksActions.saveTask, _saveTask),
  on(tasksActions.cancelEdit, _cancelEdit),
  on(tasksActions.updateEditedTask, _updateEditedTask),
  on(tasksActions.createNewTask, _createNewTask),
);

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: tasksReducer
});

