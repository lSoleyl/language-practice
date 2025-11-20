import { Component, inject } from '@angular/core';
import { TaskDisplayComponent } from '../task-display-component/task-display-component';
import { Store } from '@ngrx/store';
import { quizFeature } from '../store/quiz/quiz.reducer';
import { AsyncPipe } from '@angular/common';
import { QuizConfigComponent } from '../quiz-config-component/quiz-config-component';

@Component({
  selector: 'app-quiz-component',
  imports: [TaskDisplayComponent, QuizConfigComponent, AsyncPipe],
  templateUrl: './quiz-component.html',
  styleUrl: './quiz-component.scss',
})
export class QuizComponent {
  store = inject(Store);
  task$ = this.store.select(quizFeature.selectDisplayedTask);
}
