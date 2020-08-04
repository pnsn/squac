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
          } else if(error.error instanceof Object){
            const keys = Object.keys(error.error);
            if(keys) {
              errorMessage = "Error: ";
              for(let errorMsg of keys) {
                errorMessage += errorMsg + " " + error.error[errorMsg];
              }
            } else {
              errorMessage = "Unknown error occured."
            }
          }
          return throwError(errorMessage);
        })
      );
  }
 }
