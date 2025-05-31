import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutFailure,
  logoutSuccess,
  register,
  registerFailure,
  registerSuccess,
} from '../actions/auth.action';
import { ApiService } from '../../utils/services/api.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectError } from '../selectors/auth.selector';
import { JwtHelperService } from '@auth0/angular-jwt';
import { authTimer } from 'src/utils/services/auth-timer.service';

interface LoginResponse {
  _id: string;
  data: { name: string; email: string; token: string };
  success: boolean;
  message: string;
  expiryTime: string;
}

interface registerResponse {
  success: boolean;
  message: string;
}

interface logoutResponse {
  message: string;
  success: boolean;
}

@Injectable()
export class AuthEffects {
  action$ = inject(Actions);
  apiService = inject(ApiService);
  router: Router = inject(Router);
  store: Store = inject(Store);
  authTimerService: authTimer = inject(authTimer);

  login$ = createEffect(() =>
    this.action$.pipe(
      ofType(login),
      mergeMap(({ endPoint, body }) =>
        this.apiService.post<LoginResponse>(endPoint, body).pipe(
          map((response) => {
            if (response.success) {
              // Ensure a unique payload each time
              alert('Logged in Successfully..');
              return loginSuccess({
                user: response.data,
                expiryTime: response.expiryTime,
              });
            } else {
              return loginFailure({
                error: response.message || 'Login failed',
              });
            }
          }),
          catchError((error) =>
            of(
              loginFailure({
                error: error.error?.message || 'Login failed',
              })
            )
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(loginSuccess),
        tap(({ expiryTime }) => {
          const expiryDuration =
            new Date(expiryTime).getTime() - new Date().getTime();
          this.authTimerService.setLogoutTimer(expiryDuration, () => {
            this.store.dispatch(logout({ endPoint: 'auth/logout' }));
          });
          console.log('navigate');

          this.router.navigate(['/home']);
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(loginFailure),
        tap(() => {
          this.store.select(selectError).subscribe((error) => {
            alert('Login Failed : ' + error);
          });
          console.log('login failure called');
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.action$.pipe(
      ofType(logout),
      mergeMap(({ endPoint }) =>
        this.apiService.get<logoutResponse>(endPoint).pipe(
          map((response) => {
            if (response.success) {
              console.log('logged out...');
              return logoutSuccess();
            } else {
              return logoutFailure();
            }
          }),
          catchError((error) => of(logoutFailure()))
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(logoutSuccess),
        tap(() => {
          this.authTimerService.clearLogoutTimer();
          alert('Logged Out Successfully..');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  logoutFailure$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(logoutFailure),
        tap(() => {
          alert('Failed to Log Out...');
        })
      ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.action$.pipe(
      ofType(register),
      mergeMap(({ endPoint, body }) =>
        this.apiService.post<registerResponse>(endPoint, body).pipe(
          map((response) => {
            if (response.success) console.log('Register SuccessFully..');
            return registerSuccess();
          }),
          catchError((error) =>
            of(
              registerFailure({
                error: error.error?.message || 'Register Failed',
              })
            )
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(registerSuccess),
        tap(() => {
          alert('Registered Successfully..');
          // console.log('navigate');
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  registerFailure$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(registerFailure),
        tap(() => {
          this.store.select(selectError).subscribe((error) => {
            alert('Register Failed : ' + error);
          });
          console.log('register failure called');
        })
      ),
    { dispatch: false }
  );
}
