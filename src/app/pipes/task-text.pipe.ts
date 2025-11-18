import { Pipe, type PipeTransform } from "@angular/core";
import { TaskType, type GapTextTask, type MultipleChoiceTask, type Task } from "../store/task.types";


@Pipe({
  name: 'taskText'
})
export class TaskTextPipe implements PipeTransform {
  transform(task: Task): string {
    let fullText: string;
    if (task.type === TaskType.MULTIPLE_CHOICE) {
      fullText = (task as MultipleChoiceTask).question;
    } else if (task.type === TaskType.GAP_TEXT) {
      fullText = (task as GapTextTask).elements.map(element => element.text).join('');
    } else {
      fullText = '???';
    }
    
    if (fullText.length > 80) {
      return fullText.substring(0, 77) + '...';
    }
    return fullText;
  }
}