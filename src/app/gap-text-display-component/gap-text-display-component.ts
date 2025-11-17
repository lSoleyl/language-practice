import { Component } from '@angular/core';
import { TaskType, type GapTextElement, type GapTextTask } from '../store/task.types';
import { BasicTaskDisplayComponent } from '../basic-task-display-component/basic-task-display.component';


interface ActiveGapElement extends GapTextElement {
  enteredText: string;
  correct?: boolean;
  wrong?: boolean;
}


interface ActiveGapTextTask extends GapTextTask {
  elements: ActiveGapElement[];
}


@Component({
  selector: 'gap-text-display-component',
  imports: [],
  templateUrl: './gap-text-display-component.html',
  styleUrl: './gap-text-display-component.scss',
})
export class GapTextDisplayComponent extends BasicTaskDisplayComponent<GapTextTask> {
  currentTask?: ActiveGapTextTask;

  constructor() {
    super(TaskType.GAP_TEXT);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.task$.subscribe(task => {
      this.currentTask = {
        ...task,
        elements: task.elements.map(element => ({...element, enteredText: ''}))
      };
      // task changed -> update view
      this.cdRef.markForCheck();
    });
  }

  keyPressFilter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  gapInput(event: Event, gap: ActiveGapElement) {
    gap.enteredText = (event.target as HTMLElement).textContent;
  }

  /** Checks whether all inputs were filled correctly an will highlight them accordingly
   */
  protected override checkTask(): boolean {
    if (this.currentTask) {
      let result = true;
      for (let element of this.currentTask.elements) {
        if (element.isGap) {
          if (element.enteredText.trim() === element.text.trim()) {
            element.correct = true;
            element.wrong = false;
          } else {
            element.correct = false;
            element.wrong = true;
            result = false;
          }
        }
      }

      return result;
    }

    return false;
  }

}
