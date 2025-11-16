import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Task } from '../store/task.types';

@Component({
  selector: 'edit-single-task-component',
  imports: [],
  templateUrl: './edit-single-task-component.html',
  styleUrl: './edit-single-task-component.scss',
})
export class EditSingleTaskComponent {
  @Input({required: true}) task?: Task;
  @Output() saveTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();
}
