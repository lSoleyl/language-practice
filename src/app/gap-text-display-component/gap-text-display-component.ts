import { Component, Input, type OnInit } from '@angular/core';
import { filter, type Observable } from 'rxjs';
import { TaskType, type GapTextTask, type Task } from '../store/task.types';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-gap-text-display-component',
  imports: [AsyncPipe],
  templateUrl: './gap-text-display-component.html',
  styleUrl: './gap-text-display-component.scss',
})
export class GapTextDisplayComponent implements OnInit {
  @Input() task$?: Observable<Task>;
  gapTask$?: Observable<GapTextTask>;

  ngOnInit(): void {
    this.gapTask$ = this.task$?.pipe(filter(task => task.type === TaskType.GAP_TEXT));
  }

  keyPressFilter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

}
