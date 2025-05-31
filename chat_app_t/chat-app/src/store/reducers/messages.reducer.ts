import { createReducer, on } from '@ngrx/store';
import {
  fetchChatMessagesSuccess,
  noMessages,
  setCurrentChat,
  setNotifications,
} from '../actions/messages.action';

export interface MessageState {
  messages: any[] | null;
  currentChat: any;
  notifications: any[];
}

const initialState: MessageState = {
  messages: null,
  currentChat: null,
  notifications: [],
};

export const messageReducer = createReducer(
  initialState,
  on(fetchChatMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages,
  })),
  on(noMessages, (state) => ({
    ...state,
    messages: null,
  })),
  on(setCurrentChat, (state, { chat }) => ({
    ...state,
    currentChat: chat,
  })),
  on(setNotifications, (state, { notification }) => ({
    ...state,
    notifications: [...state.notifications, notification],
  }))
);
