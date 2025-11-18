import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { tasksFeature } from '../store/tasks/tasks.reducer';
import { TaskType, type MultipleChoiceOption, type MultipleChoiceTask } from '../store/task.types';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { cloneDeep } from 'lodash';
import { tasksActions } from '../store/tasks/tasks.actions';

@Component({
  selector: 'multiple-choice-edit-component',
  imports: [],
  templateUrl: './multiple-choice-edit-component.html',
  styleUrl: './multiple-choice-edit-component.scss',
})
export class MultipleChoiceEditComponent {
  store = inject(Store);
  task$ = this.store.select(tasksFeature.selectCurrentlyEditedTask);
  task: MultipleChoiceTask | null = null;

  destroy$ = new Subject<void>();
  cdRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.task$.pipe(
      takeUntil(this.destroy$),
      filter(task => task?.type === TaskType.MULTIPLE_CHOICE),
      map(task => task as MultipleChoiceTask)
    ).subscribe(task => {
      this.task = task ? cloneDeep(task) : null;
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Update the question when it loses focus
   */
  onQuestionBlur(event: Event) {
    const newQuestion = (event.target as HTMLElement).innerText;
    if (this.task && this.task.question !== newQuestion) {
      this.task.question = newQuestion;
      this.store.dispatch(tasksActions.updateEditedTask({task: this.task}));
    }
  }

  /** When deleting all content from a contenteditable <p> element, a single newline is left behind. 
   *  We remove it here to be able to display the placeholder
   */
  filterEmptyNewline(event: Event) {
    const questionElement = (event.target as HTMLParagraphElement);
    if (questionElement.innerText === '\n') {
      questionElement.innerText = '';
    }
  }

  /** An option has been marked or unmarked as the correct option
   */
  inputChanged(event: Event, choice: MultipleChoiceOption) {
    const newValue = (event.target as HTMLInputElement).checked;
    if (this.task && !newValue !== !choice.isCorrect) {
      if (newValue) {
        choice.isCorrect = true;
      } else {
        delete choice.isCorrect;
      }
      this.store.dispatch(tasksActions.updateEditedTask({task: this.task}));
    }
  }

  /** Update the choices text when it loses focus
   */
  onChoiceBlur(event: Event, choice: MultipleChoiceOption) {
    const newText = (event.target as HTMLElement).innerText;
    if (this.task && choice.text !== newText) {
      choice.text = newText;
      this.store.dispatch(tasksActions.updateEditedTask({task: this.task}));
    }
  }

  /** Prevent entering newlines into the choices as this looks really bad
   */
  onChoiceKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  /** A multiple choice option has been removed
   */
  deleteChoice(toRemove: MultipleChoiceOption) {
    if (this.task) {
      this.task.choices = this.task.choices.filter(choice => choice !== toRemove);
      this.store.dispatch(tasksActions.updateEditedTask({task: this.task}));
    }
  }

  addChoice() {
    if (this.task) {
      this.task.choices.push({text: ''});
      this.store.dispatch(tasksActions.updateEditedTask({task: this.task}));
    }
  }
}
