import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { canActivate } from '../utils/services/auth-guard';
import { RegisterComponent } from '../components/register/register.component';
import { isAuthenticated } from '../utils/services/isAuthenticated.service';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [isAuthenticated],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('../components/home/home.component').then((m) => m.HomeComponent),
    // component: HomeComponent,
    // canActivate: [canActivate],
  },
];
