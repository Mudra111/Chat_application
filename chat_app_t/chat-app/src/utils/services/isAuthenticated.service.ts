import { Router } from '@angular/router';
// import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../store/selectors/auth.selector';

export const isAuthenticated = () => {
  const store: Store = inject(Store);
  const router: Router = inject(Router);
  let isLoggedIn: Boolean = false;

  store.select(selectIsAuthenticated).subscribe((data) => (isLoggedIn = data));

  if (isLoggedIn) {
    router.navigate(['home']);
    return false;
  } else {
    return true;
  }
};
