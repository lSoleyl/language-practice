// Feature state containing all tasks

import { TaskCategory, TaskType, type Task } from "../task.types";


export interface PersistableTaskState {
  tasks: Task[];
  nextTaskId: number;
}

//TODO: store some statistics data in the tasks too

export interface TasksState extends PersistableTaskState {
  /** The task currently being edited
   */
  currentlyEditedTask: Task|null;
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
      ],
      lastModified: "2025-11-19T21:05:00Z",
      created: "2025-11-19T21:05:00Z"
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
      ],
      lastModified: "2025-11-19T21:05:00Z",
      created: "2025-11-19T21:05:00Z"
    },
    {
      id: 2,
      type: TaskType.MULTIPLE_CHOICE,
      category: TaskCategory.GRAMMAR,
      description: "Wie endet der Satz korrekt?",
      question: "Emma hat Angst, alleine einkaufen zu gehen, denn sie ",
      choices: [
        { text: "hat sich als Kind oft verlaufen", isCorrect: true },
        { text: "verläuft sich als Kind oft" },
        { text: "hat sich als Kind oft verloren gegangen" },
        { text: "hat sich als Kind oft verlieren" },
      ],
      lastModified: "2025-11-19T21:05:00Z",
      created: "2025-11-19T21:05:00Z"
    },
    {
      id: 3,
      type: TaskType.MULTIPLE_CHOICE,
      category: TaskCategory.VOCABULARY,
      description: "Was ist korrekt?",
      question: "Timmy hat sich durch eine flinke Art eine goldene Nase verdient.",
      choices: [
        { text: "Timmy war besonders schnell", isCorrect: true },
        { text: "Timmy war besonders langsam" },
        { text: "Timmy war besonders genau" },
        { text: "Timmy war besonders faul" },
        { text: "Timmy hat viel Geld verdient", isCorrect: true },
        { text: "Timmy ist arm geworden" },
        { text: "Timmy wurde geschlagen" },
        { text: "Timmy ist krank geworden" }
      ],
      lastModified: "2025-11-19T21:05:00Z",
      created: "2025-11-19T21:05:00Z"
    }
  ],
  nextTaskId: 4,
  currentlyEditedTask: null
};

