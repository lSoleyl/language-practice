import { createFeature, createReducer, on } from "@ngrx/store";
import { initialState, type TasksState } from "./tasks.state";
import { tasksActions, type ChangeTaskTypePayload, type SetLoadedTasksStatePayload, type TaskIdPayload, type UpdateEditedTaskPayload } from "./tasks.actions";
import { TaskCategory, TaskType, type BasicTask, type GapTextTask, type MultipleChoiceTask, type Task } from "../task.types";
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
      description: '',
      category: TaskCategory.GRAMMAR,
      elements: [],
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
  };
}


function getTaskText(task: Task) : string {
  switch (task.type) {
    case TaskType.GAP_TEXT: return (task as GapTextTask).elements.map(element => element.text).join("");
    case TaskType.MULTIPLE_CHOICE: return (task as MultipleChoiceTask).question;
  }
}


/** Converts a basic task and the task's text into a task of the specified task type.
 * 
 * @param source the task to convert from and assign the basic task properties from
 * @param text the text content of the source task
 * @param taskType the type of the new task to create
 * @returns a newly created task with most of the content from the source task
 */
function convertTask(source: BasicTask, text: string, taskType: TaskType): Task {
  switch (taskType) {
    case TaskType.GAP_TEXT: return {
      ..._.pick(source, 'id', 'description', 'category', 'created', 'lastModified'),
      type: taskType,
      elements: [{text}]
    };

    case TaskType.MULTIPLE_CHOICE: return {
      ..._.pick(source, 'id', 'description', 'category', 'created', 'lastModified'),
      type: taskType,
      question: text,
      choices: []
    };
  }
}


function _changeTaskType(state: TasksState, {taskType}: ChangeTaskTypePayload): TasksState {
  if (state.currentlyEditedTask && state.currentlyEditedTask.type !== taskType) {
    // Initialize the new task with information from the previous while omitting data, which is obsolete for the new task type
    const text = getTaskText(state.currentlyEditedTask);

    state = {
      ...state,
      currentlyEditedTask: convertTask(state.currentlyEditedTask, text, taskType)
    };
  }

  return state;
}


function _setLoadedTasksState(state: TasksState, {state: loaded}: SetLoadedTasksStatePayload): TasksState  {
  return {
    ...loaded,
    currentlyEditedTask: null
  };
}


const tasksReducer = createReducer(
  initialState,
  on(tasksActions.editTask, _editTask),
  on(tasksActions.deleteTask, _deleteTask),
  on(tasksActions.saveTask, _saveTask),
  on(tasksActions.cancelEdit, _cancelEdit),
  on(tasksActions.updateEditedTask, _updateEditedTask),
  on(tasksActions.createNewTask, _createNewTask),
  on(tasksActions.changeTaskType, _changeTaskType),
  on(tasksActions.setLoadedTasksState, _setLoadedTasksState),
);

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: tasksReducer
});

