import { Component, inject, type OnDestroy, type OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { quizFeature } from '../store/quiz/quiz.reducer';
import { ALL_TASK_CATEGORIES, ALL_TASK_TYPES, type TaskCategory, type TaskType } from '../store/task.types';
import { TaskTypePipe } from '../pipes/task-type.pipe';
import { TaskCategoryPipe } from '../pipes/task-category.pipe';
import { Subject, takeUntil } from 'rxjs';
import { pull } from 'lodash';
import { quizActions } from '../store/quiz/quiz.actions';

@Component({
  selector: 'quiz-config-component',
  imports: [TaskTypePipe, TaskCategoryPipe],
  templateUrl: './quiz-config-component.html',
  styleUrl: './quiz-config-component.scss',
})
export class QuizConfigComponent implements OnInit, OnDestroy {
  store = inject(Store);
  settings$ = this.store.select(quizFeature.selectSettings);
  destroy$ = new Subject<void>();

  allTaskTypes = ALL_TASK_TYPES;
  allTaskCategories = ALL_TASK_CATEGORIES;

  typeFilter: TaskType[] = [];
  categoryFilter: TaskCategory[] = [];


  ngOnInit(): void {
    this.settings$.pipe(takeUntil(this.destroy$)).subscribe(settings => {
      this.typeFilter = [...settings.types];
      this.categoryFilter = [...settings.categories];
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTypeFilter(type: TaskType) {
    if (this.typeFilter.includes(type)) {
      pull(this.typeFilter, type);
    } else {
      this.typeFilter.push(type);
    }
  }

  toggleCategoryFilter(category: TaskCategory) {
    if (this.categoryFilter.includes(category)) {
      pull(this.categoryFilter, category);
    } else {
      this.categoryFilter.push(category);
    }
  }

  startQuiz() {
    this.store.dispatch(quizActions.updateQuizSettings({settings: {
      types: this.typeFilter,
      categories: this.categoryFilter
    }}));
    
    this.store.dispatch(quizActions.selectNextTask());
  }
}
