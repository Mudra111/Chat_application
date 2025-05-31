import { createAction, props } from '@ngrx/store';

export const login = createAction(
  'login',
  props<{ endPoint: string; body: any }>()
);

export const loginSuccess = createAction(
  'loginSuccess',
  props<{ user: any; expiryTime: any }>()
);

export const loginFailure = createAction(
  'loginFailure',
  props<{ error: string }>()
);

export const register = createAction(
  'register',
  props<{ endPoint: string; body: any }>()
);

export const registerSuccess = createAction('registerSuccess');

export const registerFailure = createAction(
  'registerFailure',
  props<{ error: string }>()
);

export const logout = createAction('logout', props<{ endPoint: string }>());

export const logoutSuccess = createAction('logoutSuccess');

export const logoutFailure = createAction('logoutFailure');

export const setOnlineUsers = createAction(
  'setOnlineUsers',
  props<{ onlineUsers: any }>()
);
