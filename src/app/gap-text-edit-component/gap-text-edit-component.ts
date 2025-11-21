import { ChangeDetectorRef, Component, inject, ViewChild, type ElementRef, type OnDestroy, type OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { tasksFeature } from '../store/tasks/tasks.reducer';
import { TaskType, type GapTextElement, type GapTextTask } from '../store/task.types';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { cloneDeep, findIndex, isEqual, some } from 'lodash';
import { tasksActions } from '../store/tasks/tasks.actions';
import { SelectionRange } from '../selection/selection.class';


interface TextNodeEntry {
  node: Node;
  text: string;
  isGap: boolean;
};


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

  /** Use to assign a unique id to each ever seen GapTextElement to 
   *  avoid all the editing bugs caused by element tracking of @for
   */
  trackIds = new Map<GapTextElement, number>();

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

  /** Assigns each element a unique id. The only purpose is to defeat the mandatory element tracking in @for
   *  as it causes all kinds of editing issues in combination with the contenteditable paragraph element
   */
  trackId(element: GapTextElement): number {
    if (this.trackIds.has(element)) {
      return this.trackIds.get(element)!;
    }

    this.trackIds.set(element, this.trackIds.size);
    return this.trackIds.get(element)!;
  }


  /** Calculate the 'elements' array from the paragraph's content and update the currently edited task
   */
  onBlur() {
    if (!this.task) {
      return;
    }

    const paragraph = this.contentElement!.nativeElement;

    // When deleting all content in the contenteditable field the browser always leaves behind a <br>... get rid of it
    if (paragraph.innerText === '\n') {
      paragraph.innerText = '';
    }
    
    // Collect all text nodes and convert them into our gap text structure and update the task from it
    this.updateFromTextNodeEntries(this.collectAllTextNodes());
  }


  onKeydown(event: KeyboardEvent) {
    if (event.key == 'g' && event.ctrlKey) {
      event.preventDefault(); // disable browser default for CTRL+G (which is the same as CTRL+F)

      // Now process the selected content
      const paragraph = this.contentElement?.nativeElement!;
      
      
      const selection = SelectionRange.getCurrent();
      if (!selection || !selection.isInElement(paragraph)) {
        return; // nothing to do
      }

      if (selection.isEmpty()) {
        // A simple cursor: expand the selection to include the full word surrounding the cursor
        selection.expandToFullWord();
      }

      // We consider a gap marked if the selection contains a gap anywhere...
      const gapMarked = some(selection.selectionNodes(), node => node.parentElement?.className === 'gap');

      let nodes = this.collectAllTextNodes();
      const startNodeIndex = findIndex(nodes, entry => entry.node === selection.start.node);
      
      const startNode = nodes[startNodeIndex];
      startNode.text = selection.prefix();

      if (selection.isSingleNode()) {
        // start node and end node are the same -> split them into two nodes before continuing
        nodes.splice(startNodeIndex+1, 0, {...startNode, text: selection.suffix()});
      } else {
        // otherwise delete all nodes between start and end
        while (nodes[startNodeIndex+1].node !== selection.end.node) {
          nodes.splice(startNodeIndex+1, 1);
        }
        const endNode = nodes[startNodeIndex+1];
        endNode.text = selection.suffix();
      }

      // Now insert the new element after the start element
      // We use the start nodes Node object, just because the type requires a node
      nodes.splice(startNodeIndex+1, 0, { text: selection.content(), isGap: !gapMarked, node: startNode.node });

      // Finally filter out any empty gap elements, which we may have created this way
      nodes = nodes.filter(node => node.text !== '');


      // Now update the edited task, which will in turn update the display
      this.updateFromTextNodeEntries(nodes);
    }
  }

  /** Collects all the text child nodes of the conteneditable paragraph element with the node, text content and whether it is marked as gap
   */
  private collectAllTextNodes() : TextNodeEntry[] {
    const nodes: TextNodeEntry[] = [];

    const paragraph = this.contentElement!.nativeElement;
    for (let child of paragraph.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        // a direct text child node of the paragraph... this only happens when deleting all content
        nodes.push({node: child, text: child.textContent!, isGap: false});
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const childElement = child as HTMLElement;
        if (childElement.tagName.toLowerCase() === 'span') {
          // One of the spans, which were created by the @for() all of the children are considered text nodes (some may actually be <br> elements)
          const span = child as HTMLSpanElement;
          const isGap = span.className === 'gap';
          for (let node of span.childNodes) {
            nodes.push({node: node, text: node.textContent!, isGap: isGap});
          }
        } else if (childElement.tagName.toLowerCase() === 'br') {
          nodes.push({node: childElement, text: '\n', isGap: false });
        }
      }
    }
    return nodes;
  }

  /** Converts the passed text node entry array into an array of gap text elements, where neighboring
   *  elements of the same type have already been merged. It will then update the currently edited task
   *  from this array if any change is detected.
   */
  private updateFromTextNodeEntries(entries: TextNodeEntry[]) {
    // First convert the text node entries into the gap text element format
    const elements: GapTextElement[] = entries.map(node => node.isGap ? ({text:node.text, isGap:true}) : ({text:node.text}));
    
    // Now merge two neighboring text/gap elements to avoid creating unneeded elements
    for (let i = 1; i < elements.length;) {
      if (elements[i].isGap === elements[i-1].isGap) {
        // Two consecutive same type elements -> combine them into one
        elements[i-1].text += elements[i].text;
        elements.splice(i,1); // remove the latter element
      } else {
        ++i;
      }
    }

    // Finally update the currently edited task in the store if anything changed (to not perform any update if we just focused something)
    if (this.task && !isEqual(this.task.elements, elements)) {
      this.task.elements = elements;
      this.store.dispatch(tasksActions.updateEditedTask({task: this.task}));
    }

    const paragraph = this.contentElement?.nativeElement!;
    // Remove all plain text nodes, which are direct children of the paragraph. They can only be created when the input was completely empty before
    // for an empty task and we must delete them to avoid @for() generating a new copy of the text on each blur
    for (let node of paragraph.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        paragraph.removeChild(node);
      }
    }
  }
}
