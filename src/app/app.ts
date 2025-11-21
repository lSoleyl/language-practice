import { Component, inject, type OnInit } from '@angular/core';
import { HeaderComponent } from './header-component/header-component';
import { Store } from '@ngrx/store';
import { navigationActions } from './store/navigation/navigation.actions';
import { AsyncPipe, NgComponentOutlet } from '@angular/common';
import { QuizComponent } from './quiz-component/quiz-component';
import { EditTasksComponent } from './edit-tasks-component/edit-tasks-component';
import { selectActiveView } from './store/navigation/navigation.selectors';
import { map } from 'rxjs';
import { uiActions } from './store/ui/ui.actions';
import { tasksActions } from './store/tasks/tasks.actions';

interface ViewComponent {
  id: string,
  description: string,
  componentType: any
}


const VIEW_COMPONENTS: ViewComponent[] = [
  {id: 'quiz', description: 'Quiz', componentType: QuizComponent },
  {id: 'edit-tasks', description: 'Aufgaben verwalten', componentType: EditTasksComponent }
];


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [HeaderComponent, NgComponentOutlet, AsyncPipe]
})
export class App implements OnInit {
  store = inject(Store);

  activeComponent$ = this.store.select(selectActiveView).pipe(map(id => VIEW_COMPONENTS.find(view => view.id === id)?.componentType));

  ngOnInit(): void {
    // Load saved ui and tasks state
    this.store.dispatch(uiActions.loadSavedState());
    this.store.dispatch(tasksActions.loadSavedState());

    for (let view of VIEW_COMPONENTS) {
      this.store.dispatch(navigationActions.registerView({id: view.id, description: view.description }));
    }
  }
}
