import { Component, Input, type OnInit, type Type } from '@angular/core';
import type { Task } from '../store/task.types';
import { map, Subject, type Observable } from 'rxjs';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { GapTextDisplayComponent } from '../gap-text-display-component/gap-text-display-component';


const DISPLAY_COMPONENTS: Record<Task['type'], Type<any>> = {
  'gap-text': GapTextDisplayComponent
}


@Component({
  selector: 'quiz-display-component',
  imports: [NgComponentOutlet, AsyncPipe],
  templateUrl: './quiz-display-component.html',
  styleUrl: './quiz-display-component.scss',
})
export class QuizDisplayComponent implements OnInit {
  @Input({required:true}) task$?: Observable<Task | undefined>;
  displayComponent$?: Observable<Type<any> | null>;

  checkTask = new Subject<(correct: boolean)=>void>();

  ngOnInit(): void {
    this.displayComponent$ = this.task$?.pipe(map(task => task ? DISPLAY_COMPONENTS[task.type] : null));
  }

  performCheck() {
    this.checkTask.next((success: boolean) => {});
  }
}
