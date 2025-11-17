import { ChangeDetectorRef, Directive, inject, Input, type OnDestroy, type OnInit } from "@angular/core";
import { ReplaySubject, Subject, takeUntil, type Observable } from "rxjs";
import type { Task, TaskType } from "../store/task.types";



/** Abstract base class for task display comonents implementing the common boilerplate
 */
@Directive()
export abstract class BasicTaskDisplayComponent<ConcreteTaskType extends Task> implements OnInit, OnDestroy {
  @Input({alias: 'task$'}) private _rawTask$?: Observable<Task>;
  // Passed as input into this component. This will trigger the check for correctness
  @Input() private triggerCheck$?: Observable<(correct: boolean)=>void>;

  /** Internal subject used for mapping the Task into ConcreteTask while
   *  ensuring that task$ is always defined.
   */
  private taskSubject = new ReplaySubject<ConcreteTaskType>(1);

  /** Emits and completes as soon as the component is destroyed
   */
  destroy$ = new Subject<void>();
  cdRef = inject(ChangeDetectorRef);

  /** Holds the filtered tasks matching only the requested task type. 
   *  This observable is always defined (in contrast to the task$ input observable)
   */
  task$: Observable<ConcreteTaskType> = this.taskSubject;

  /** 
   * @param taskType the type to filter tasks for
   */
  constructor(private taskType: TaskType) {}

  ngOnInit(): void {
    this._rawTask$?.pipe(takeUntil(this.destroy$)).subscribe(task => {
      if (task.type === this.taskType) {
        this.taskSubject.next(task as ConcreteTaskType);
      }
    });

    this.triggerCheck$?.pipe(takeUntil(this.destroy$)).subscribe(callback => {
      callback(this.checkTask());
      this.cdRef.markForCheck(); // checkTask() will change the display to highlight errors.
    });
  }

  ngOnDestroy(): void {
    this.taskSubject.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }


  /** Must be implemented by the deriving class to check the user input and give UI feedback about the input
   * 
   * @return false if input was incorrect, true otherwise
   */
  protected abstract checkTask(): boolean;
}