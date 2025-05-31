import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { firstValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class fetchAllUser {
  apiService: ApiService = inject(ApiService);

  fetchAllUsers = async () => {
    try {
      const response: any = await firstValueFrom(this.apiService.get(`user/`));

      if (response && response.success) {
        return response.users;
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
