import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { mergeMap, catchError } from 'rxjs/operators';

const SECURED_ENDPOINTS = [
  {
    url: '/api/orders',
    methods: ['GET', 'PUT', 'DELETE']
  },
  {
    url: '/api/games',
    methods: ['POST', 'PUT', 'DELETE']
  }
];

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const securedEndpoint = SECURED_ENDPOINTS.find(endpoint => endpoint.url === req.url);
    if (securedEndpoint && securedEndpoint.methods.includes(req.method)) {
      return this.auth.getTokenSilently$().pipe(
        mergeMap(token => {
          const tokenReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next.handle(tokenReq);
        }),
        catchError(err => throwError(err))
      );
    }
    return next.handle(req);
  }
}
