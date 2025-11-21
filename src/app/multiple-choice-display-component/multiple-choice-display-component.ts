import { Component } from '@angular/core';
import { TaskType, type MultipleChoiceOption, type MultipleChoiceTask } from '../store/task.types';
import { BasicTaskDisplayComponent } from '../basic-task-display-component/basic-task-display.component';
import { shuffle } from 'lodash';

interface ActiveChoiceOption extends MultipleChoiceOption {
  checked?: boolean;
  class?: string; // class to display (for already checked tasks)
}

interface ActiveMultipleChoiceTask extends MultipleChoiceTask {
  choices: ActiveChoiceOption[];
}

@Component({
  selector: 'multiple-choice-display-component',
  imports: [],
  templateUrl: './multiple-choice-display-component.html',
  styleUrl: './multiple-choice-display-component.scss',
})
export class MultipleChoiceDisplayComponent extends BasicTaskDisplayComponent<MultipleChoiceTask> {
  constructor() {
    super(TaskType.MULTIPLE_CHOICE);
  }
  
  currentTask?: ActiveMultipleChoiceTask;

  override ngOnInit(): void {
    super.ngOnInit();

    this.task$.subscribe(task => {
      //TODO: randomly reorder choices
      this.currentTask = {
        ...task,
        choices: shuffle(task.choices.map(option => ({...option}) as ActiveChoiceOption))
      };
      this.cdRef.markForCheck(); // update display
    });
  }

  inputChanged(event: Event, option: ActiveChoiceOption) {
    option.checked = (event.target as HTMLInputElement).checked;
  }

  protected override checkTask(): boolean {
    if (this.currentTask) {
      let result = true;

      for (let choice of this.currentTask.choices) {
        if (!!choice.checked !== !!choice.isCorrect) {
          choice.class = 'wrong';
          result = false;
        } else {
          choice.class = 'correct';
        }
      }
      
      return result;
    }

    return false;
  }
}
