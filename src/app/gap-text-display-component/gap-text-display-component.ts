import { ChangeDetectorRef, Component, inject, Input, type OnDestroy, type OnInit } from '@angular/core';
import { filter, Subject, takeUntil, type Observable } from 'rxjs';
import { TaskType, type GapTextElement, type GapTextTask, type Task } from '../store/task.types';
import { AsyncPipe } from '@angular/common';
import { Actions } from '@ngrx/effects';


interface ActiveGapElement extends GapTextElement {
  enteredText: string;
  correct?: boolean;
  wrong?: boolean;
}


interface ActiveGapTextTask extends GapTextTask {
  elements: ActiveGapElement[];
}


@Component({
  selector: 'app-gap-text-display-component',
  imports: [],
  templateUrl: './gap-text-display-component.html',
  styleUrl: './gap-text-display-component.scss',
})
export class GapTextDisplayComponent implements OnInit, OnDestroy {
  @Input() task$?: Observable<Task>;
  destroy$ = new Subject<void>();
  cdRef = inject(ChangeDetectorRef);
  currentTask?: ActiveGapTextTask;

  // Passed as input into this component. This will trigger the check for correctness
  @Input() triggerCheck$?: Observable<(correct: boolean)=>void>;
  

  ngOnInit(): void {
    this.task$?.pipe(
      takeUntil(this.destroy$),
      filter(task => task.type === TaskType.GAP_TEXT)
    ).subscribe(task => {
      this.currentTask = {
        ...task,
        elements: task.elements.map(element => ({...element, enteredText: ''}))
      };
      // task changed -> update view
      this.cdRef.markForCheck();
    });

    this.triggerCheck$?.pipe(takeUntil(this.destroy$)).subscribe(callback => callback(this.checkTask()));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
  checkTask(): boolean {
    if (this.currentTask) {
      for (let element of this.currentTask.elements) {
        if (element.isGap) {
          if (element.enteredText.trim() === element.text.trim()) {
            element.correct = true;
            element.wrong = false;
          } else {
            element.correct = false;
            element.wrong = true;
          }
        }
      }


    }

    return false;
  }

}
