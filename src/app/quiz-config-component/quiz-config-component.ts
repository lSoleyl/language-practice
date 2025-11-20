import { ChangeDetectorRef, Component, inject, type OnDestroy, type OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { quizFeature } from '../store/quiz/quiz.reducer';
import { ALL_TASK_CATEGORIES, ALL_TASK_TYPES, type Task, type TaskCategory, type TaskType } from '../store/task.types';
import { TaskTypePipe } from '../pipes/task-type.pipe';
import { TaskCategoryPipe } from '../pipes/task-category.pipe';
import { Subject, takeUntil } from 'rxjs';
import { cloneDeep, pull } from 'lodash';
import { quizActions } from '../store/quiz/quiz.actions';
import { tasksFeature } from '../store/tasks/tasks.reducer';
import { taskMatchesFilter } from '../store/quiz/quiz.functions';
import type { QuizSettings } from '../store/quiz/quiz.state';

@Component({
  selector: 'quiz-config-component',
  imports: [TaskTypePipe, TaskCategoryPipe],
  templateUrl: './quiz-config-component.html',
  styleUrl: './quiz-config-component.scss',
})
export class QuizConfigComponent implements OnInit, OnDestroy {
  store = inject(Store);
  cdRef = inject(ChangeDetectorRef);
  destroy$ = new Subject<void>();
  tasks: Task[] = [];

  allTaskTypes = ALL_TASK_TYPES;
  allTaskCategories = ALL_TASK_CATEGORIES;

  settings: QuizSettings = {
    types: [],
    categories: []
  };

  matchedTasks = 0;


  ngOnInit(): void {
    this.store.select(quizFeature.selectSettings).pipe(takeUntil(this.destroy$)).subscribe(settings => {
      this.settings = cloneDeep(settings);
      this.updateTaskNumbers();
    });

    this.store.select(tasksFeature.selectTasks).pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.tasks = tasks;
      this.updateTaskNumbers();
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTypeFilter(type: TaskType) {
    if (this.settings.types.includes(type)) {
      pull(this.settings.types, type);
    } else {
      this.settings.types.push(type);
    }
    this.updateTaskNumbers();
  }

  toggleCategoryFilter(category: TaskCategory) {
    if (this.settings.categories.includes(category)) {
      pull(this.settings.categories, category);
    } else {
      this.settings.categories.push(category);
    }
    this.updateTaskNumbers();
  }

  updateTaskNumbers() {
    this.matchedTasks = this.tasks.filter(task => taskMatchesFilter(task, this.settings)).length;
    this.cdRef.markForCheck();
  }

  startQuiz() {
    this.store.dispatch(quizActions.updateQuizSettings({settings: this.settings}));
    this.store.dispatch(quizActions.selectNextTask());
  }
}
