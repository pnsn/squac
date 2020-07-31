import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
 } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        // retry(1), //TODO: enable retrys after CORS fixed
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof Error) {
            // client-side error
            console.log("Client error", error);
            errorMessage = 'Error: ' + error.error.message;
          } else if (error.error instanceof String){
            console.log("Server error", error);
            // server-side error
            errorMessage = 'Error: ' + error.error;
          } else {
            // errorMessage =
            console.log("error has a weird format", error)
          }
          return throwError(errorMessage);
        })
      );
  }
 }
