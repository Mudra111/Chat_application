import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectIsTheme } from '../../store/selectors/theme.selector';
import { CommonModule } from '@angular/common';
import { OnThemeChange } from '../../store/actions/theme.action';
import {
  selectIsAuthenticated,
  selectIsRegistered,
  selectUser,
} from '../../store/selectors/auth.selector';
import { RouterLink } from '@angular/router';
import { logout } from '../../store/actions/auth.action';
import { take } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, DoCheck {
  store: Store = inject(Store);
  theme!: Boolean;
  userName: String = '';
  isAuthenticated: Boolean = false;
  // isRegistered: Boolean = false;

  ngOnInit() {
    this.store.select(selectIsTheme).subscribe((data) => (this.theme = data));

    this.store
      .select(selectUser)
      .subscribe((data) => (this.userName = data?.name));

    this.store
      .select(selectIsAuthenticated)
      .pipe(take(1))
      .subscribe((islogged) => {
        this.isAuthenticated = islogged;
      });
  }

  ngDoCheck() {
    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((data) => (this.userName = data?.name));

    this.store
      .select(selectIsAuthenticated)
      .pipe(take(1))
      .subscribe((islogged) => {
        this.isAuthenticated = islogged;
      });

    // this.store
    //   .select(selectIsRegistered)
    //   .pipe(take(1))
    //   .subscribe((isregistered) => {
    //     this.isRegistered = isregistered;
    //   });
  }

  changeTheme() {
    this.store.dispatch(OnThemeChange());
  }

  logout() {
    let endpoint = 'auth/logout';
    this.store.dispatch(logout({ endPoint: endpoint }));
  }

  autoLogout(expirationDuration: number) {
    setTimeout(() => {
      this.logout();
      console.log('log out called inside setTimeout');
    }, expirationDuration);
  }
}
