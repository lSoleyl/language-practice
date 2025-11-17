import { ChangeDetectorRef, Component, inject, type OnDestroy, type OnInit } from '@angular/core';
import { ALL_TASK_CATEGORIES, ALL_TASK_TYPES, TaskType, type Task, type TaskCategory } from '../store/task.types';
import { TaskTypePipe } from '../pipes/task-type.pipe';
import { TaskCategoryPipe } from '../pipes/task-category.pipe';
import { Store } from '@ngrx/store';
import { tasksActions } from '../store/tasks/tasks.actions';
import { tasksFeature } from '../store/tasks/tasks.reducer';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'edit-single-task-component',
  imports: [TaskTypePipe, TaskCategoryPipe],
  templateUrl: './edit-single-task-component.html',
  styleUrl: './edit-single-task-component.scss',
})
export class EditSingleTaskComponent implements OnInit, OnDestroy {
  store = inject(Store);
  task$ = this.store.select(tasksFeature.selectCurrentlyEditedTask);
  task: Partial<Task> = {};

  destroy$ = new Subject<void>();
  cdRef = inject(ChangeDetectorRef);

  allTaskTypes = ALL_TASK_TYPES;
  allTaskCategories = ALL_TASK_CATEGORIES;
  currentTaskType?: TaskType;
  currentTaskCategory?: TaskCategory;

  //TODO: select currentTaskType in the select
  ngOnInit(): void {
    this.task$.pipe(takeUntil(this.destroy$)).subscribe(task => {
      this.task = task ? {...task} : {};
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTaskType(event: Event) {
    this.currentTaskType = (event.target as HTMLSelectElement).value as TaskType;
    //TODO: update the task type and the displayed edit component
  }

  saveTask() {
    if (this.task.id !== undefined) {
      this.store.dispatch(tasksActions.saveTask());
    }
  }

  deleteTask() {
    if (this.task.id !== undefined) {
      this.store.dispatch(tasksActions.deleteTask({id: this.task.id}));
    }
  }
}
