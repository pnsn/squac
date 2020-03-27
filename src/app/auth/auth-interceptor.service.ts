import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()

// Intercepts http requests and adds auth token.
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (this.authService.loggedIn) {
      const modifiedReq = req.clone({
        headers : new HttpHeaders(
          {
            Authorization : 'Token ' + this.authService.auth
          }
        )
      });
      return next.handle(modifiedReq);
    }

    return next.handle(req);

  }
}
