import { ChangeDetectorRef, Component, inject, ViewChild, type ElementRef, type OnDestroy, type OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { tasksFeature } from '../store/tasks/tasks.reducer';
import { TaskType, type GapTextElement, type GapTextTask } from '../store/task.types';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { cloneDeep, isEqual } from 'lodash';
import { tasksActions } from '../store/tasks/tasks.actions';

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

  @ViewChild('content')
  contentElement?: ElementRef<HTMLParagraphElement>;

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


  /** Calculate the 'elements' array from the paragraph's content and update the currently edited task
   */
  onBlur(event: Event) {
    if (!this.task) {
      return;
    }

    const parent = this.contentElement!.nativeElement;
    
    // When deleting all content in the contenteditable field the browser always leaves behind a <br>... get rid of it
    if (parent.innerText === '\n') {
      parent.innerText = '';
    }
    
    
    // Now simply iterate over all children and convert them into corresponding gap elements
    const elements: GapTextElement[] = [];
    for (let child of parent.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        // A simple text node (only achievable when deleting all content or starting with an empty input field)
        elements.push({text: child.textContent!});
      } else {
        // One of the spans, which were created by the @for()
        const span = child as HTMLSpanElement;
        const text = span.innerText;
        if (text) { // ignore empty spans
          if (span.className === 'gap') {
            // A gap
            elements.push({text: span.innerText, isGap: true});
          } else {
            // Regular in between text
            elements.push({text: span.innerText});
          }
        }
      }
    }

    // Finally update the currently edited task in the store if anything changed (to not perform any update if we just focused something)
    if (!isEqual(this.task.elements, elements)) {
      this.task.elements = elements;
      this.store.dispatch(tasksActions.updateEditedTask({task: this.task}));
    }
  }


  onKeydown(event: KeyboardEvent) {
    if (event.key == 'g' && event.ctrlKey) {
      event.preventDefault(); // disable browser default for CTRL+G (which is the same as CTRL+F)

      // Now toggle the selection on the 
      const element = event.target as HTMLElement;
      //TODO: implement moving of marked text
    }
  }
}
