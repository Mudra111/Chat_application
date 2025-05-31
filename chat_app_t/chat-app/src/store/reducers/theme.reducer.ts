import { createReducer, on } from '@ngrx/store';
import { OnThemeChange } from '../actions/theme.action';

export interface theme {
  theme: Boolean;
}

export const initialTheme: theme = {
  theme: false,
};

export const themeReducer = createReducer(
  initialTheme,
  on(OnThemeChange, (state) => ({ ...state, theme: !state.theme }))
);
