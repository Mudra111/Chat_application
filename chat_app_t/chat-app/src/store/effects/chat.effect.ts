import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../utils/services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getChatFailure,
  getUserChats,
  userChatsGetSuccess,
} from '../actions/chat.action';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { ChatServices } from 'src/utils/services/chat.service';

interface ChatResponse {
  chat: any;
}

@Injectable()
export class ChatEffects {
  action$ = inject(Actions);
  apiService = inject(ApiService);
  chatService: ChatServices = inject(ChatServices);

  getUserChats$ = createEffect(() =>
    this.action$.pipe(
      ofType(getUserChats),
      mergeMap(({ endpoint }) =>
        this.apiService.get<ChatResponse>(endpoint).pipe(
          map((response) => {
            console.log('getting chats..');
            return userChatsGetSuccess({ chat: response });
          }),
          catchError((error) =>
            of(
              getChatFailure({ error: error.error?.message || 'Login Failed' })
            )
          )
        )
      )
    )
  );

  userChatsGetSuccess$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(userChatsGetSuccess),
        tap(({ chat }) => {
          // console.log(chat);
          // alert('chat fetched..');
          //
        })
      ),
    { dispatch: false }
  );

  getChatFailure$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(getChatFailure),
        tap(({ error }) => {
          console.log('error occurs in retrieving chats..' + error);
        })
      ),
    { dispatch: false }
  );
}
