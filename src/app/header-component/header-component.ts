import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectViews } from '../store/navigation/navigation.selectors';
import { AsyncPipe } from '@angular/common';
import { navigationActions } from '../store/navigation/navigation.actions';

@Component({
  selector: 'header-component',
  imports: [AsyncPipe],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
  standalone: true
})
export class HeaderComponent {
  store = inject(Store);
  views$ = this.store.select(selectViews);
  

  selectView(id: string) {
    this.store.dispatch(navigationActions.selectView({id}));
  }
}
