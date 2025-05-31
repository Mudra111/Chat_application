import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PwaPromptService {
  private deferredPrompt: any;
  private _promptAvailable$ = new BehaviorSubject<Boolean>(false);

  get promptAvailable$(): Observable<Boolean> {
    return this._promptAvailable$.asObservable();
  }

  constructor() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this._promptAvailable$.next(true);
    });
  }

  showInstallPrompt() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choice: any) => {
        if (choice === 'accepted') {
          console.log('user accepted install prompt..');
        } else {
          console.log('user rejected install prompt..');
        }

        this.deferredPrompt = null;
        this._promptAvailable$.next(false);
      });
    }
  }
}
