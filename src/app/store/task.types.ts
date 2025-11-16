export enum TaskType {
  GAP_TEXT = 'gap-text'
};


export interface BasicTask {
  id: number;
  type: TaskType;
  category: string;
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

