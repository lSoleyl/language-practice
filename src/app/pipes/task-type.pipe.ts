import { Pipe, type PipeTransform } from "@angular/core";
import { TaskType } from "../store/task.types";


@Pipe({
  name: 'taskType'
})
export class TaskTypePipe implements PipeTransform {
  transform(type: TaskType | null): string {
    if (!type) {
      return '';
    }

    switch (type) {
      case TaskType.GAP_TEXT: return 'Lückentext';
      case TaskType.MULTIPLE_CHOICE: return 'Multiple Choice';
      default: return '???';
    }
  }
}