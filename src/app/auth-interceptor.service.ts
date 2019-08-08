import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    // if correct url -> to squac make sure to send token
    // const modifiedRequest = req.clone({})
    // return next.handle(modifiedRequest).pipe(tap(event => {
    //  
    //}));
    return next.handle(req);
  }
}