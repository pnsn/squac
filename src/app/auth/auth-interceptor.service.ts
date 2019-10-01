import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()

// Intercepts http requests and adds auth token.
// TODO: change to just SQUAC API requests
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap ( user => {
        if (!user) {
          return next.handle(req);
        }

        const modifiedReq = req.clone({
          headers : new HttpHeaders(
            {
              Authorization : 'Token ' + user.token
            }
          )
        });
        return next.handle(modifiedReq);
      }));
  }
}
