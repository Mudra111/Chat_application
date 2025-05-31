import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { fetchChatMessages } from 'src/store/actions/messages.action';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  apiService: ApiService = inject(ApiService);
  store: Store = inject(Store);

  sendMessage = async (
    currentChatId: string,
    textMessage: string,
    senderId: string
  ) => {
    const body = {
      chatId: currentChatId,
      text: textMessage,
      senderId: senderId,
    };

    const endpoint = 'message/createMessage';

    try {
      const response: any = await firstValueFrom(
        this.apiService.post(endpoint, body)
      );

      if (response && response.success) {
        const endpoint = 'message/getMessages';
        const chatId = currentChatId;
        this.store.dispatch(
          fetchChatMessages({ endpoint: endpoint, chatId: chatId })
        );
        return;
      } else {
        console.error(
          'Error Sending message:',
          response?.message || 'Unknown error'
        );
        return;
      }
    } catch (error) {
      console.error('API call failed:', error);
      return;
    }
  };
}
