import { ChangeDetectorRef, Component, inject, Input, type OnDestroy, type OnInit, type Type } from '@angular/core';
import { Task, TaskType } from '../store/task.types';
import { map, Subject, takeUntil, tap, type Observable } from 'rxjs';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { GapTextDisplayComponent } from '../gap-text-display-component/gap-text-display-component';
import { Store } from '@ngrx/store';
import { quizActions } from '../store/quiz/quiz.actions';
import { MultipleChoiceDisplayComponent } from '../multiple-choice-display-component/multiple-choice-display-component';
import { TaskCategoryPipe } from '../pipes/task-category.pipe';
import { quizFeature } from '../store/quiz/quiz.reducer';
import type { QuizStats } from '../store/quiz/quiz.state';


const DISPLAY_COMPONENTS: Record<TaskType, Type<any>> = {
  [TaskType.GAP_TEXT]: GapTextDisplayComponent,
  [TaskType.MULTIPLE_CHOICE]: MultipleChoiceDisplayComponent,
};


@Component({
  selector: 'task-display-component',
  imports: [NgComponentOutlet, AsyncPipe, TaskCategoryPipe],
  templateUrl: './task-display-component.html',
  styleUrl: './task-display-component.scss',
})
export class TaskDisplayComponent implements OnInit, OnDestroy {
  @Input({required:true}) task$?: Observable<Task | null>;
  displayComponent$?: Observable<Type<any> | null>;
  destroy$ = new Subject<void>();
  cdRef = inject(ChangeDetectorRef);
  store = inject(Store);
  checkedTask = false;

  stats$ = this.store.select(quizFeature.selectStats).pipe(takeUntil(this.destroy$));
  stats: QuizStats = {correct: 0, skipped: 0, wrong: 0};

  checkTask = new Subject<(correct: boolean)=>void>();

  ngOnInit(): void {
    this.displayComponent$ = this.task$?.pipe(
      map(task => task ? DISPLAY_COMPONENTS[task.type] : null),
      tap(() => this.checkedTask = false)
    );

    this.stats$.subscribe(stats => this.stats = stats);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  performCheck() {
    this.checkTask.next((success: boolean) => {
      this.checkedTask = true; // hide the check button
      this.cdRef.markForCheck();

      if (success) {
        this.store.dispatch(quizActions.updateQuizStats({stats: {...this.stats, correct: this.stats.correct+1 }}));
      } else {
        this.store.dispatch(quizActions.updateQuizStats({stats: {...this.stats, wrong: this.stats.wrong+1 }}));
      }
    });
  }

  nextTask() {
    this.store.dispatch(quizActions.selectNextTask());
  }

  skipTask() {
    this.store.dispatch(quizActions.updateQuizStats({stats: {...this.stats, skipped: this.stats.skipped+1 }}));
    this.store.dispatch(quizActions.selectNextTask());
  }

  abortQuiz() {
    this.store.dispatch(quizActions.selectTask({task: null}));
  }
}
