import { Pipe, type PipeTransform } from "@angular/core";
import type { Task } from "../store/task.types";


@Pipe({
  name: 'taskText'
})
export class TaskTextPipe implements PipeTransform {
  transform(task: Task): string {
    let fullText: string;
    if ('question' in task) {
      fullText = task.question;
    } else {
      fullText = task.elements.map(element => element.text).join('');
    }
    
    if (fullText.length > 80) {
      return fullText.substring(0, 77) + '...';
    }
    return fullText;
  }
}