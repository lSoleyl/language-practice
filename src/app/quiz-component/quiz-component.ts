import { Component, inject, type OnInit } from '@angular/core';
import { QuizDisplayComponent } from "../quiz-display-component/quiz-display-component";
import { Store } from '@ngrx/store';
import { quizFeature } from '../store/quiz/quiz.reducer';
import { quizActions } from '../store/quiz/quiz.actions';

@Component({
  selector: 'app-quiz-component',
  imports: [QuizDisplayComponent],
  templateUrl: './quiz-component.html',
  styleUrl: './quiz-component.scss',
})
export class QuizComponent implements OnInit {
  store = inject(Store);
  task$ = this.store.select(quizFeature.selectDisplayedTask)


  ngOnInit(): void {
    this.store.dispatch(quizActions.selectRandomTask({}));
  }
}
