import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { Store } from '@ngrx/store';
import { selectIsTheme } from '../store/selectors/theme.selector';
import { CommonModule } from '@angular/common';
import { filter, take } from 'rxjs';
import {
  selectExpiryTime,
  selectIsAuthenticated,
} from 'src/store/selectors/auth.selector';
import { logout } from 'src/store/actions/auth.action';
import { authTimer } from 'src/utils/services/auth-timer.service';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { PwaPromptService } from 'src/utils/services/pwa-prompt.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chat-app';

  store: Store = inject(Store);
  theme!: Boolean;
  authTimerService: authTimer = inject(authTimer);

  installAvailable!: Boolean;

  constructor(
    private updates: SwUpdate,
    private pwaPromptService: PwaPromptService
  ) {
    this.updates.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(() => {
        if (confirm('New version available. Load New version ? ')) {
          this.updates.activateUpdate().then(() => {
            document.location.reload();
          });
        }
      });
  }

  ngOnInit() {
    this.pwaPromptService.promptAvailable$.subscribe((isAvailable) => {
      this.installAvailable = isAvailable;
    });

    this.store.select(selectIsTheme).subscribe((data) => (this.theme = data));

    this.store
      .select(selectExpiryTime)
      .pipe(take(1))
      .subscribe((expiryDuration) => {
        if (expiryDuration !== null) {
          const expireAt = new Date(expiryDuration).getTime();
          const now = new Date().getTime();
          const remaining = expireAt - now;
          console.log(remaining);

          if (remaining <= 0) {
            this.store.dispatch(logout({ endPoint: 'auth/logout' }));
          } else {
            this.authTimerService.setLogoutTimer(remaining, () => {
              this.store.dispatch(logout({ endPoint: 'auth/logout' }));
            });
          }
        }
      });
  }

  showIndtall() {
    this.pwaPromptService.showInstallPrompt();
  }
}
