import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:3003/';
  store: Store = inject(Store);

  constructor(private http: HttpClient) {}
  //get request with params
  get<T>(endPoint: string, params?: Record<string, any>): Observable<T> {
    const url = new URL(`${this.baseUrl}${endPoint}`);
    console.log('api called');

    if (params) {
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });
    }
    console.log('url:' + url);

    return this.http.get<T>(url.toString());
  }

  //post request
  post<T>(endPoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    const url = `${this.baseUrl}${endPoint}`;
    console.log('api called');

    return this.http.post<T>(url, body);
  }
}
