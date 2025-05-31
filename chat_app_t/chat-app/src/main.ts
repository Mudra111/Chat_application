import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/ngsw-worker.js')
        .then((reg) => {
          console.log('service worker registered successfully...', reg);
        })
        .catch((err) => {
          console.log('service worker registration failed..', err);
        });
    });
  }
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
