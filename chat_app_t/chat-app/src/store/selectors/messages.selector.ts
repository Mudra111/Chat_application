import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState } from '../reducers/messages.reducer';

export const selectMessageState =
  createFeatureSelector<MessageState>('messagesReducer');

export const selectMessages = createSelector(
  selectMessageState,
  (data) => data.messages
);

export const selectCurrentChat = createSelector(
  selectMessageState,
  (data) => data.currentChat
);

export const selectNotifications = createSelector(
  selectMessageState,
  (data) => data.notifications
);
