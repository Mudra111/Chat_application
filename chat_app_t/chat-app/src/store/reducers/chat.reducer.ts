import { createReducer, on } from '@ngrx/store';
import {
  getChatFailure,
  getUserChats,
  userChatsGetSuccess,
} from '../actions/chat.action';

export interface chats {
  chat: any;
  error: any;
}

export const initialState: chats = {
  chat: null,
  error: null,
};

export const chatReducer = createReducer(
  initialState,
  on(userChatsGetSuccess, (state, { chat }) => ({
    ...state,
    chat,
    error: null,
  })),
  on(getChatFailure, (state, { error }) => ({ ...state, error, chat: null }))
);
