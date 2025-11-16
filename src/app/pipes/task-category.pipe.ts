import { Pipe, type PipeTransform } from "@angular/core";
import { TaskCategory } from "../store/task.types";


@Pipe({
  name: 'taskCategory'
})
export class TaskCategoryPipe implements PipeTransform {
  transform(type: TaskCategory): string {
    switch (type) {
      case TaskCategory.GRAMMAR: return 'Grammatik';
      case TaskCategory.VOCABULARY: return 'Wortschatz';
      default: return '???';
    }
  }
}