import { createReducer, on } from '@ngrx/store';
import {
  loginFailure,
  loginSuccess,
  logoutSuccess,
  registerFailure,
  registerSuccess,
  setOnlineUsers,
} from '../actions/auth.action';

export interface authState {
  user: any | null;
  isLogged: boolean;
  isRegistered: boolean;
  error: string | null;
  expiryTime: string | null;
  onlineUsers: any;
}

export const initialState: authState = {
  user: null,
  isLogged: false,
  isRegistered: false,
  error: null,
  expiryTime: null,
  onlineUsers: null,
};

export const authReducer = createReducer(
  initialState,

  on(loginSuccess, (state, { user, expiryTime }) => ({
    ...state,
    isLogged: true,
    user,
    expiryTime,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isLogged: false,
    error,
  })),
  on(logoutSuccess, (state) => ({
    ...state,
    user: null,
    expiryTime: null,
    isLogged: false,
    error: null,
  })),
  on(registerSuccess, (state) => ({
    ...state,
    isRegistered: true,
  })),
  on(registerFailure, (state, { error }) => ({
    ...state,
    isRegistered: false,
    error,
  })),
  on(setOnlineUsers, (state, { onlineUsers }) => ({
    ...state,
    onlineUsers,
  }))
);
