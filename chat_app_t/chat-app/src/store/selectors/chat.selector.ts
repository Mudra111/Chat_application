import { createFeatureSelector, createSelector } from '@ngrx/store';
import { chats } from '../reducers/chat.reducer';

export const selectChatState = createFeatureSelector<chats>('chat');

export const selectChats = createSelector(selectChatState, (data) => data.chat);

export const selectChatError = createSelector(
  selectChatState,
  (data) => data.error
);
