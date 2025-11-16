export enum TaskType {
  GAP_TEXT = 'gap-text'
};

export enum TaskCategory {
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary'
};

export interface BasicTask {
  id: number;
  type: TaskType;
  category: TaskCategory;
}


export interface GapTextElement { 
  text: string, 
  isGap?: boolean
};


export interface GapTextTask extends BasicTask {
  description?: string; // additional aid/description
  elements: GapTextElement[];
}

export type Task = GapTextTask;

