import { ChangeDetectorRef, Component, inject, Input, type OnInit, type Type } from '@angular/core';
import type { Task } from '../store/task.types';
import { map, Subject, tap, type Observable } from 'rxjs';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { GapTextDisplayComponent } from '../gap-text-display-component/gap-text-display-component';
import { Store } from '@ngrx/store';
import { quizActions } from '../store/quiz/quiz.actions';


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
  @Input({required:true}) task$?: Observable<Task | null>;
  displayComponent$?: Observable<Type<any> | null>;
  cdRef = inject(ChangeDetectorRef);
  store = inject(Store);
  checkedTask = false;

  checkTask = new Subject<(correct: boolean)=>void>();

  ngOnInit(): void {
    this.displayComponent$ = this.task$?.pipe(
      map(task => task ? DISPLAY_COMPONENTS[task.type] : null),
      tap(() => this.checkedTask = false)
    );
  }

  performCheck() {
    this.checkTask.next((success: boolean) => {
      this.checkedTask = true; // hide the check button
      this.cdRef.markForCheck();
    });
  }

  nextTask() {
    //FIXME: pass whichever filter was set by the user
    this.store.dispatch(quizActions.selectRandomTask({}));
  }
}
