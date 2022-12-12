import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
  HttpEvent,
} from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";

/**
 * Intercepts http requests and adds auth token
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /**
   * Adds auth token to headers of requests
   *
   * @param req http request
   * @param next http handler
   * @returns handle request
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // if user is logged in, add headers
    if (this.authService.isAuthenticated()) {
      const modifiedReq = req.clone({
        headers: new HttpHeaders({
          Authorization: "Token " + this.authService.auth,
        }),
      });
      return next.handle(modifiedReq);
    }

    return next.handle(req);
  }
}
