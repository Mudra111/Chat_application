import { createFeatureSelector, createSelector } from '@ngrx/store';
import { theme } from '../reducers/theme.reducer';

export const selectThemeState = createFeatureSelector<theme>('theme');

export const selectIsTheme = createSelector(
  selectThemeState,
  (state) => state.theme
);
