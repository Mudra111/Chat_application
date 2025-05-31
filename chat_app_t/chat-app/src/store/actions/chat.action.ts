import { createAction, props } from '@ngrx/store';

export const getUserChats = createAction(
  'getUserChats',
  props<{ endpoint: string }>()
);

export const userChatsGetSuccess = createAction(
  'userChatsGetSuccess',
  props<{ chat: any }>()
);

export const getChatFailure = createAction(
  'getChatFailure',
  props<{ error: String }>()
);
