import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideState, provideStore } from '@ngrx/store';
import { navigationFeature } from './store/navigation/navigation.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { tasksFeature } from './store/tasks/tasks.reducer';
import { quizFeature } from './store/quiz/quiz.reducer';
import { provideEffects } from '@ngrx/effects';
import { QuizEffects } from './store/quiz/quiz.effects';
import { uiFeature } from './store/ui/ui.reducer';
import { UIEffects } from './store/ui/ui.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideStore(),
    provideState(navigationFeature),
    provideState(tasksFeature),
    provideState(quizFeature),
    provideState(uiFeature),
    provideEffects(QuizEffects),
    provideEffects(UIEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
