import { Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { TaskType, type Task } from '../store/task.types';
import { TaskTypePipe } from '../pipes/task-type.pipe';

@Component({
  selector: 'edit-single-task-component',
  imports: [TaskTypePipe],
  templateUrl: './edit-single-task-component.html',
  styleUrl: './edit-single-task-component.scss',
})
export class EditSingleTaskComponent implements OnInit {
  @Input({required: true}) task?: Task;
  @Output() saveTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  allTaskTypes = [TaskType.GAP_TEXT, TaskType.MULTIPLE_CHOICE];
  currentTaskType?: TaskType;

  //TODO: select currentTaskType in the select
  ngOnInit(): void {
    this.currentTaskType = this.task?.type;
  }

  changeTaskType(event: Event) {
    this.currentTaskType = (event.target as HTMLSelectElement).value as TaskType;
    //TODO: update the task type and the displayed edit component
  }
}
