import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
// import { selectUser } from 'src/store/selectors/auth.selector';
// import { take } from 'node_modules/cypress/types/lodash';
import {
  getUserChats,
  // userChatsGetSuccess,
} from 'src/store/actions/chat.action';
// import {
//   fetchChatMessages,
//   fetchChatMessagesSuccess,
// } from 'src/store/actions/messages.action';

@Injectable({
  providedIn: 'root',
})
export class ChatServices {
  apiService: ApiService = inject(ApiService);
  store: Store = inject(Store);
  latestMessages: any = [];

  createNewChat = async (user: any, currentUser: any) => {
    try {
      const body = {
        firstId: currentUser._id,
        secondId: user._id,
      };

      const response: any = await firstValueFrom(
        this.apiService.post('chat/createChat', body)
      );

      if (response && response.success) {
        alert('Chat created successfully');

        const endpoint = `chat/find/${currentUser._id}`;

        this.store.dispatch(getUserChats({ endpoint: endpoint }));

        return;
      } else {
        console.error(
          'Error fetching user:',
          response?.message || 'Unknown error'
        );
        return;
      }
    } catch (error) {
      console.error('API call failed:', error);
      return;
    }
  };

  // async fetchLatestMessage(chat: any) {
  //   const endpoint = 'message/getMessages';
  //   const chatId = chat._id;
  //   try {
  //     const response: any = await firstValueFrom(
  //       this.apiService.get(`${endpoint}/${chatId}`)
  //     );

  //     // console.log(response);

  //     let latestMsg = response[response.length - 1];

  //     console.log(latestMsg);

  //     const findMsg = this.latestMessages.find(
  //       (msg: any) => msg?.chatId === chat?._id
  //     );

  //     if (findMsg) {
  //       this.latestMessages = this.latestMessages.filter((msg: any) => {
  //         if (msg?.chatId === chat?._id) {
  //           msg = latestMsg;
  //         }
  //       });
  //     } else {
  //       this.latestMessages.push(latestMsg);
  //     }

  //     console.log(
  //       this.latestMessages,
  //       '............................................'
  //     );

  //     return latestMsg;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
}
