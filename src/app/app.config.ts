import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideState, provideStore } from '@ngrx/store';
import { navigationFeature } from './store/navigation/navigation.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideStore(),
    provideState(navigationFeature),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
