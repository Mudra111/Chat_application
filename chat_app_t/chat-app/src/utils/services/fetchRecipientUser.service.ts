import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class fetchRecipientUser {
  recipientUser: any;
  apiService: ApiService = inject(ApiService);

  fetchRecipientUser = async (currentUser: any, chat: any) => {
    let recipientId = chat?.members.find((id: any) => id !== currentUser._id);

    if (recipientId == null) {
      recipientId = currentUser._id;
    }

    try {
      const response: any = await firstValueFrom(
        this.apiService.get(`user/${recipientId}`)
      );

      if (response) {
        return response.user;
      } else {
        console.error(
          'Error fetching user:',
          response?.message || 'Unknown error'
        );
        return null;
      }
    } catch (error) {
      console.error('API call failed:', error);
      return null;
    }
  };
}
