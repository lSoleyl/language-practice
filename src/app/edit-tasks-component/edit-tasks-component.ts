import { Component, inject } from '@angular/core';
import { EditTasksListComponent } from "../edit-tasks-list-component/edit-tasks-list-component";
import type { Task } from '../store/task.types';
import { Store } from '@ngrx/store';
import { tasksActions } from '../store/tasks/tasks.actions';
import { EditSingleTaskComponent } from '../edit-single-task-component/edit-single-task-component';

@Component({
  selector: 'app-edit-tasks-component',
  imports: [EditTasksListComponent, EditSingleTaskComponent],
  templateUrl: './edit-tasks-component.html',
  styleUrl: './edit-tasks-component.scss',
})
export class EditTasksComponent {
  store = inject(Store);
  editedTask?: Task;


  editTask(task: Task) {
    this.editedTask = task;
  }

  deleteTask(task: Task) {
    this.store.dispatch(tasksActions.deleteTask({id: task.id}));
    this.editedTask = undefined;
  }

  saveTask(task: Task) {
    //TODO: Dispatch an action, which will save the modified task object
  }
}
