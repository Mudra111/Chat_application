import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authState } from '../reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<authState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectIsRegistered = createSelector(
  selectAuthState,
  (state) => state.isRegistered
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => !!state.user
);

export const selectExpiryTime = createSelector(
  selectAuthState,
  (state) => state.expiryTime
);

export const selectOnlineUsers = createSelector(
  selectAuthState,
  (state) => state.onlineUsers
);
