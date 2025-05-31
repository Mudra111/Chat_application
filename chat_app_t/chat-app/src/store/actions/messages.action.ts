import { createAction, props } from '@ngrx/store';

// Fetch user details (one by one)
export const fetchChatMessages = createAction(
  'fetchChatMessages',
  props<{ endpoint: string; chatId: string }>()
);

export const fetchChatMessagesSuccess = createAction(
  'fetchChatMessagesSuccess',
  props<{ messages: any }>()
);

export const noMessages = createAction('noChats');

export const setCurrentChat = createAction(
  'setCurrentChat',
  props<{ chat: any }>()
);

export const setNotifications = createAction(
  'setNotifications',
  props<{ notification: any }>()
);
