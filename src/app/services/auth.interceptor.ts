import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = 'Bearer mock-token-12345';
    const authReq = req.clone({
      setHeaders: { Authorization: authToken },
    });

    console.log('Request:', authReq);

    return next.handle(authReq);
  }
}
