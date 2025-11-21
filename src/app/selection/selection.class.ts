

export class SelectionAnchor {
  constructor(public node: Node, public offset: number) {}


}

/** Selection range with inclusive start and exclusive end
 */
export class SelectionRange {
  constructor(public start: SelectionAnchor, public end: SelectionAnchor) {}


  static getCurrent() : SelectionRange | undefined {
    const selection = window.getSelection();

    if (!selection || !selection.focusNode || !selection.anchorNode) {
      return undefined; // no selection
    }

    if (selection.focusNode.nodeType !== Node.TEXT_NODE || selection.anchorNode.nodeType !== Node.TEXT_NODE) {
      // Unsupported selection
      return undefined;
    }

    // The selection starts at anchorOffset within the anchorNode and ends at the focusOffset within the focusNode
    // if direction == 'backward' then the focusNode located before the anchorNode
    let start = new SelectionAnchor(selection.anchorNode, selection.anchorOffset);
    let end = new SelectionAnchor(selection.focusNode, selection.focusOffset);

    if (selection.direction === 'backward') {
      // Reverse selection, the start node is the focus node
      [start,end] = [end,start];
    }

    return new SelectionRange(start, end);
  }


  /** Expands the selection range to include full words. Stops at the first whitespace character or end of node.
   */
  expandToFullWord() {
    while (this.start.offset > 0 && !this.isWordEnd(this.start.node.textContent![this.start.offset-1])) {
      --this.start.offset;
    }

    // Only expand end selection if the end does not already end at a word
    if (!this.isWordEnd(this.end.node.textContent![this.end.offset-1])) {
      while (this.end.node.textContent![this.end.offset] && !this.isWordEnd(this.end.node.textContent![this.end.offset])) {
        ++this.end.offset;
      }
    }
  }

  /** Returns true if the given string is a word end character (whitespace, ',', '.')
   */
  private isWordEnd(letter: string): boolean {
    if (letter.trim() === '') {
      return true; // whitespace
    }

    return letter === ',' || letter === '.';
  }


  /** Returns true if start node and end node are contained within the specified element
   */
  isInElement(parentElement: HTMLElement): boolean {
    const hasParent: (node:Node, parent: HTMLElement) => boolean = (node: Node, parent: HTMLElement) => {
      if (!node.parentNode) {
        return false;
      }
      return node.parentElement === parent || hasParent(node.parentNode, parent);
    };

    return hasParent(this.start.node, parentElement) && hasParent(this.end.node, parentElement);
  }

  /** Returns a list of all nodes, which span the selection
   */
  selectionNodes(): Node[] {
    if (this.isSingleNode()) {
      return [this.start.node];
    }
    return [this.start.node, ...this.innerSelectionNodes(), this.end.node];
  }

  /** returns only the inner/enclosed selection nodes (i.e. not including start and end)
   */
  innerSelectionNodes(): Node[] {
    if (this.isSingleNode()) {
      return []; // the below loop won't end if we enter it in this situtation
    }

    const nodes = [];
    for (let node = this.getNextNodeSibling(this.start.node); node && node !== this.end.node; node = this.getNextNodeSibling(node)) {
      nodes.push(node);
    }
    return nodes;
  }

  /** True if this selection is confined to only one text node
   */
  isSingleNode(): boolean {
    return this.start.node === this.end.node;
  }


  /** Returns true if the selection is just a cursor (no actual selection)
   */
  isEmpty(): boolean {
    return this.isSingleNode() && this.start.offset === this.end.offset;
  }

  /** Returns the text content of the start node before the start of the selection
   */
  prefix(): string {
    return this.start.node.textContent!.substring(0, this.start.offset);
  }

  /** Returns the text content of the end node after the end of the selection
   */
  suffix(): string {
    return this.end.node.textContent!.substring(this.end.offset);
  }

  /** Returns the selected text content
   */
  content(): string {
    if (this.isSingleNode()) {
      return this.start.node.textContent!.substring(this.start.offset, this.end.offset);
    }

    let nodes = this.innerSelectionNodes();
    let content = this.start.node.textContent!.substring(this.start.offset);

    for (let node of nodes) {
      content += node.textContent;
    }

    content += this.end.node.textContent!.substring(0, this.end.offset);
    return content;
  }

  /** Retrieves the next sibling node under the assumption of elements being structured as follows:
   *  <p><span>text,text</span><span>text</span>...</p>
   */
  private getNextNodeSibling(node: Node): Node | undefined {
    if (node.nextSibling) {
      return node.nextSibling;
    }

    // Otherwise we have so switch into the next element
    let nextElement = this.getNextElementSibling(node.parentElement!);
    return nextElement ? this.getFirstChildNode(nextElement) : undefined;
  }

  /** Returns the first sibling of the passed element or the first sibling of the element's parent if the 
   *  element is the parent's last child.
   */
  private getNextElementSibling(element: Element): Element | undefined {
    if (element.nextElementSibling) {
      return element.nextElementSibling;
    }

    // Otherwise return the parent element's sibling
    return element.parentElement ? this.getNextElementSibling(element.parentElement) : undefined;
  }

  /** Returns an elements first text node child by drilling into firstChild/firstElementChild until a textNode or a node without a child is found
   */
  private getFirstChildNode(element: Element): Node | undefined {
    let firstChild = element.firstChild;
    if (!firstChild) {
      return undefined;
    }

    if (firstChild.nodeType === Node.TEXT_NODE || !firstChild.firstChild) {
      return firstChild;
    }

    return element.firstElementChild ? this.getFirstChildNode(element.firstElementChild) : undefined;
  }
} 

