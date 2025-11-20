import type { Task } from "../task.types";
import type { QuizSettings } from "./quiz.state";


/** True if the task should be selected according to the filter specified in the quiz settings
 */
export function taskMatchesFilter(task: Task, settings: QuizSettings): boolean {
  if (settings.types.length && !settings.types.includes(task.type)) {
    return false;
  }

  if (settings.categories.length && !settings.categories.includes(task.category)) {
    return false;
  }

  return true;
}