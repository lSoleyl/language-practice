import { Component, inject, Input, type OnDestroy, type OnInit } from '@angular/core';
import { filter, Subject, type Observable } from 'rxjs';
import { TaskType, type GapTextElement, type GapTextTask, type Task } from '../store/task.types';
import { AsyncPipe } from '@angular/common';


interface ActiveGapElement extends GapTextElement {
  enteredText: string;
}


interface ActiveGapTextTask extends GapTextTask {
  elements: ActiveGapElement[];
}


@Component({
  selector: 'app-gap-text-display-component',
  imports: [AsyncPipe],
  templateUrl: './gap-text-display-component.html',
  styleUrl: './gap-text-display-component.scss',
})
export class GapTextDisplayComponent implements OnInit, OnDestroy {
  @Input() task$?: Observable<Task>;
  gapTask$?: Observable<GapTextTask>;
  destroy$ = new Subject<void>();


  ngOnInit(): void {
    this.gapTask$ = this.task$?.pipe(filter(task => task.type === TaskType.GAP_TEXT));
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

}
