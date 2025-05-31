import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { MetaReducer, provideStore } from '@ngrx/store';
import { themeReducer } from '../store/reducers/theme.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AuthInterceptorService } from '../utils/services/auth-interceptors.service';
import { authReducer } from '../store/reducers/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from '../store/effects/auth.effect';
import { chatReducer } from '../store/reducers/chat.reducer';
import { ChatEffects } from '../store/effects/chat.effect';
import { MessageEffect } from '../store/effects/messages.effect';
import { messageReducer } from '../store/reducers/messages.reducer';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { provideServiceWorker } from '@angular/service-worker';

export function localStorageSyncReducer(reducer: any) {
  return (state: any, action: any) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorageSync({
        keys: ['theme', 'auth', 'chat', 'messagesReducer'],
        rehydrate: true,
      })(reducer)(state, action);
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [localStorageSyncReducer];

export const appConfig: ApplicationConfig = {
  providers: [
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore(
      {
        theme: themeReducer,
        auth: authReducer,
        chat: chatReducer,
        messagesReducer: messageReducer,
      },
      { metaReducers }
    ),
    provideEffects(AuthEffects, ChatEffects, MessageEffect), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
};
