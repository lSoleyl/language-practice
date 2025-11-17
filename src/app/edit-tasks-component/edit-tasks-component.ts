import { Component, inject } from '@angular/core';
import { EditTasksListComponent } from "../edit-tasks-list-component/edit-tasks-list-component";
import { Store } from '@ngrx/store';
import { EditSingleTaskComponent } from '../edit-single-task-component/edit-single-task-component';
import { tasksFeature } from '../store/tasks/tasks.reducer';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-edit-tasks-component',
  imports: [EditTasksListComponent, EditSingleTaskComponent, AsyncPipe],
  templateUrl: './edit-tasks-component.html',
  styleUrl: './edit-tasks-component.scss',
})
export class EditTasksComponent {
  store = inject(Store);
  editedTask$ = this.store.select(tasksFeature.selectCurrentlyEditedTask);
}
