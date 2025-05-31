import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { first, map, mergeMap, Observable, switchMap, take } from 'rxjs';
import { selectUser } from '../../store/selectors/auth.selector';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select(selectUser).pipe(
      take(1),
      switchMap((user) => {
        console.log(user);

        if (
          req.method === 'GET' ||
          (req.method === 'POST' && req.url.includes('/chat/createChat'))
        ) {
          // If token exists, clone and modify request
          const authReq = user?.token
            ? req.clone({
                headers: req.headers.set(
                  'authorization',
                  `Bearer ${user.token}`
                ),
              })
            : req;

          return next.handle(authReq);
        }
        // Directly return the result of next.handle()
        return next.handle(req);
      })
    );
  }
}
