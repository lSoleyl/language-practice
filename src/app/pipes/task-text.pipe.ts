import { Pipe, type PipeTransform } from "@angular/core";
import type { Task } from "../store/task.types";


@Pipe({
  name: 'taskText'
})
export class TaskTextPipe implements PipeTransform {
  transform(task: Task): string {
    const fullText = task.elements.map(element => element.text).join('');
    if (fullText.length > 80) {
      return fullText.substring(0, 77) + '...';
    }
    return fullText;
  }
}