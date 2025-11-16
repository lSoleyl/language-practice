import { Pipe, type PipeTransform } from "@angular/core";
import { TaskType } from "../store/task.types";


@Pipe({
  name: 'taskType'
})
export class TaskTypePipe implements PipeTransform {
  transform(type: TaskType): string {
    switch (type) {
      case TaskType.GAP_TEXT: return 'Lückentext';
      default: return '???';
    }
  }
}