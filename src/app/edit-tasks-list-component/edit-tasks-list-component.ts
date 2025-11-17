import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { tasksFeature } from '../store/tasks/tasks.reducer';
import { AsyncPipe } from '@angular/common';
import { TaskTextPipe } from '../pipes/task-text.pipe';
import { TaskTypePipe } from '../pipes/task-type.pipe';
import { TaskCategoryPipe } from '../pipes/task-category.pipe';
import type { Task } from '../store/task.types';
import { tasksActions } from '../store/tasks/tasks.actions';

@Component({
  selector: 'edit-tasks-list-component',
  imports: [AsyncPipe, TaskTextPipe, TaskTypePipe, TaskCategoryPipe],
  templateUrl: './edit-tasks-list-component.html',
  styleUrl: './edit-tasks-list-component.scss',
})
export class EditTasksListComponent {
  store = inject(Store);
  allTasks$ = this.store.select(tasksFeature.selectTasks);

  editTask(task: Task) {
    this.store.dispatch(tasksActions.editTask({id: task.id}));
  }

  deleteTask(task: Task) {
    this.store.dispatch(tasksActions.deleteTask({id: task.id}));
  }
}
