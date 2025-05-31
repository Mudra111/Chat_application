import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ApiService } from '../../utils/services/api.service';
import {
  fetchChatMessages,
  fetchChatMessagesSuccess,
  noMessages,
  setCurrentChat,
} from '../actions/messages.action';

export interface userResponse {
  user: any;
  message: String;
}

@Injectable()
export class MessageEffect {
  action$ = inject(Actions);
  apiService = inject(ApiService);

  fetchChatMessages$ = createEffect(() =>
    this.action$.pipe(
      ofType(fetchChatMessages),
      mergeMap(({ endpoint, chatId }) =>
        this.apiService.get<userResponse>(`${endpoint}/${chatId}`).pipe(
          map((response) => {
            console.log('getting Messages..');
            return fetchChatMessagesSuccess({ messages: response });
          })
        )
      )
    )
  );

  fetchChatMessagesSuccess$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(fetchChatMessagesSuccess),
        tap(({ messages }) => {
          console.log(messages);
        })
      ),
    { dispatch: false }
  );
}
