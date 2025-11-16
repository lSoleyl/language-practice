import { Component, inject } from '@angular/core';
import { EditTasksListComponent } from "../edit-tasks-list-component/edit-tasks-list-component";
import type { Task } from '../store/task.types';
import { Store } from '@ngrx/store';
import { tasksActions } from '../store/tasks/tasks.actions';

@Component({
  selector: 'app-edit-tasks-component',
  imports: [EditTasksListComponent],
  templateUrl: './edit-tasks-component.html',
  styleUrl: './edit-tasks-component.scss',
})
export class EditTasksComponent {
  store = inject(Store);



  editTask(task: Task) {

  }

  deleteTask(task: Task) {
    this.store.dispatch(tasksActions.deleteTask({id: task.id}));
  }

}
