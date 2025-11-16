// Feature state containing all tasks

import { TaskType, type Task } from "../task.types";


//TODO: store some statistics data in the tasks too

export interface TasksState {
  tasks: Task[];
  nextTaskId: number;
}

export const initialState: TasksState = {
  tasks: [
    {
      id: 0,
      type: TaskType.GAP_TEXT,
      category: 'grammar',
      description: "Setze die Wörter 'zu' und 'nach' ein",
      elements: [
        {text: 'Ich gehe heute '},
        {text: 'nach', isGap: true},
        {text: ' Hause und spiele '},
        {text: 'zu', isGap: true},
        {text: ' Hause Computer'}
      ]
    }
  ],
  nextTaskId: 1
};

