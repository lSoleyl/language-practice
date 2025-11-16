// Feature state containing all tasks

import { TaskCategory, TaskType, type Task } from "../task.types";


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
      category: TaskCategory.GRAMMAR,
      description: "Setze die Wörter 'zu' und 'nach' ein",
      elements: [
        {text: 'Ich gehe heute '},
        {text: 'nach', isGap: true},
        {text: ' Hause und spiele '},
        {text: 'zu', isGap: true},
        {text: ' Hause Computer.'}
      ]
    },
    {
      id: 1,
      type: TaskType.GAP_TEXT,
      category: TaskCategory.GRAMMAR,
      description: "Formen von 'zu'",
      elements: [
        {text: 'Zu', isGap: true},
        {text: ' Hause sehe ich '},
        {text: 'zur', isGap: true},
        {text: ' Mittagszeit '},
        {text: 'zu', isGap: true},
        {text: ', wie Nachbarn '},
        {text: 'zum', isGap: true},
        {text: ' Spaß Würstchen grillen.'}
      ]
    }
  ],
  nextTaskId: 2
};

