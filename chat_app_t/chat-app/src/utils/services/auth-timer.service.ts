import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { logout } from 'src/store/actions/auth.action';

@Injectable({
  providedIn: 'root',
})
export class authTimer {
  private logoutTimer: any;
  store: Store = inject(Store);

  setLogoutTimer(expiryDuration: number, logoutCallback: () => void) {
    this.clearLogoutTimer();
    this.logoutTimer = setTimeout(() => {
      logoutCallback();
    }, expiryDuration);
  }

  clearLogoutTimer() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }
}
