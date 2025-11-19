export enum TaskType {
  GAP_TEXT = 'gap-text',
  MULTIPLE_CHOICE = 'multiple-choice'
}

export const ALL_TASK_TYPES = [ TaskType.GAP_TEXT, TaskType.MULTIPLE_CHOICE ];

export enum TaskCategory {
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary'
}

export const ALL_TASK_CATEGORIES = [ TaskCategory.GRAMMAR, TaskCategory.VOCABULARY ];

export interface BasicTask {
  id: number;
  type: TaskType;
  category: TaskCategory;
  description: string; // additional aid/description

  lastModified: string;
  created: string;
}

export interface GapTextElement { 
  text: string, 
  isGap?: boolean
}


export interface GapTextTask extends BasicTask {
  elements: GapTextElement[];
}

export interface MultipleChoiceOption {
  text: string;
  isCorrect?: boolean;
}

export interface MultipleChoiceTask extends BasicTask {
  question: string;  
  choices: MultipleChoiceOption[];
}

export type Task = GapTextTask | MultipleChoiceTask;

