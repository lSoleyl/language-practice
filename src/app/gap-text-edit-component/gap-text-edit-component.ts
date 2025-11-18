import { ChangeDetectorRef, Component, inject, type OnDestroy, type OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { tasksFeature } from '../store/tasks/tasks.reducer';
import { TaskType, type GapTextTask, type Task } from '../store/task.types';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'gap-text-edit-component',
  imports: [],
  templateUrl: './gap-text-edit-component.html',
  styleUrl: './gap-text-edit-component.scss',
})
export class GapTextEditComponent implements OnInit, OnDestroy {
  store = inject(Store);
  task$ = this.store.select(tasksFeature.selectCurrentlyEditedTask);
  task: GapTextTask | null = null;

  destroy$ = new Subject<void>();
  cdRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.task$.pipe(
      takeUntil(this.destroy$),
      filter(task => task?.type === TaskType.GAP_TEXT),
      map(task => task as GapTextTask)
    ).subscribe(task => {
      this.task = task ? cloneDeep(task) : null;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
