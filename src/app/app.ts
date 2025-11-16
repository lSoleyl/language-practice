import { Component, inject, signal, type OnInit } from '@angular/core';
import { HeaderComponent } from './header-component/header-component';
import { Store } from '@ngrx/store';
import { navigationActions } from './store/navigation/navigation.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [ HeaderComponent ],
  standalone: true
})
export class App implements OnInit {
  protected readonly title = signal('language-practice');
  store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(navigationActions.registerView({id: 'quiz', description: 'Quiz' }));
    this.store.dispatch(navigationActions.registerView({id: 'edit', description: 'Aufgaben verwalten' }));
  }

}
