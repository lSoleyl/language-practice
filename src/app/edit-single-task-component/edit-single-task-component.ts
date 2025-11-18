import { ChangeDetectorRef, Component, inject, type OnDestroy, type OnInit, type Type } from '@angular/core';
import { ALL_TASK_CATEGORIES, ALL_TASK_TYPES, TaskType, type Task, type TaskCategory } from '../store/task.types';
import { TaskTypePipe } from '../pipes/task-type.pipe';
import { TaskCategoryPipe } from '../pipes/task-category.pipe';
import { Store } from '@ngrx/store';
import { tasksActions } from '../store/tasks/tasks.actions';
import { tasksFeature } from '../store/tasks/tasks.reducer';
import { Subject, takeUntil } from 'rxjs';
import { NgComponentOutlet } from '@angular/common';
import { GapTextEditComponent } from '../gap-text-edit-component/gap-text-edit-component';
import { MultipleChoiceEditComponent } from '../multiple-choice-edit-component/multiple-choice-edit-component';
import { cloneDeep } from 'lodash';


const EDIT_COMPONENTS: Record<TaskType, Type<any>> = {
  [TaskType.GAP_TEXT]: GapTextEditComponent,
  [TaskType.MULTIPLE_CHOICE]: MultipleChoiceEditComponent,
};


@Component({
  selector: 'edit-single-task-component',
  imports: [TaskTypePipe, TaskCategoryPipe, NgComponentOutlet],
  templateUrl: './edit-single-task-component.html',
  styleUrl: './edit-single-task-component.scss',
})
export class EditSingleTaskComponent implements OnInit, OnDestroy {
  store = inject(Store);
  task$ = this.store.select(tasksFeature.selectCurrentlyEditedTask);
  task: Task | null = null;

  destroy$ = new Subject<void>();
  cdRef = inject(ChangeDetectorRef);

  editComponent: Type<any> | null = null;
  allTaskTypes = ALL_TASK_TYPES;
  allTaskCategories = ALL_TASK_CATEGORIES;
  currentTaskCategory?: TaskCategory;

  //TODO: select currentTaskType in the select
  ngOnInit(): void {
    this.task$.pipe(takeUntil(this.destroy$)).subscribe(task => {
      this.task = task ? cloneDeep(task) : null;
      this.editComponent = task ? EDIT_COMPONENTS[task.type] : null;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTaskType(event: Event) {
    if (this.task) {
      this.task.type = (event.target as HTMLSelectElement).value as TaskType;
      this.store.dispatch(tasksActions.updateEditedTask({task: this.task}));
    }
  }

  changeTaskCategory(event: Event) {
    if (this.task) {
      this.task.category = (event.target as HTMLSelectElement).value as TaskCategory;
      this.store.dispatch(tasksActions.updateEditedTask({task: this.task}));
    }
  }

  saveTask() {
    if (this.task) {
      this.store.dispatch(tasksActions.saveTask());
    }
  }

  deleteTask() {
    if (this.task) {
      this.store.dispatch(tasksActions.deleteTask({id: this.task.id}));
    }
  }

  cancelEdit() {
    this.store.dispatch(tasksActions.cancelEdit());
  }

  filterEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  /** Updates the tasks description whenever the description field loses focus
   */
  updateDescription(event: Event) {
    if (this.task) {
      const newDescription = (event.target as HTMLElement).innerText;
      if (this.task.description !== newDescription) {
        this.task.description = newDescription;
        this.store.dispatch(tasksActions.updateEditedTask({task: this.task}));
      }
    }
  }

  /** This function is necessary to be able to completely clear the task's description field and display the help text again
   */
  filterEmptyNewline(event: Event) {
    const input = event.target as HTMLElement;
    if (input.innerText === '\n') {
      input.innerText = '';
    }
  }
}
