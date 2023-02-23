import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

/**
 * Intercepts and formats http error responses for uniformity
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  /**
   * Intercepts request and catches errors
   *
   * @param request http request
   * @param next http handler
   * @returns throws error with formatted message
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // retry(1), //TODO: enable retrys after CORS fixed
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "Unknown error occured.";
        if (error.error instanceof Error) {
          // client-side error
          errorMessage = error.error.message;
        } else if (typeof error.error === "string") {
          // server-side error
          errorMessage = error.error;
        } else if (error.error instanceof Object) {
          errorMessage = "";
          const keys = Object.keys(error.error);
          if (keys) {
            for (const errorMsg of keys) {
              errorMessage += error.error[errorMsg];
            }
          }
        }
        throw new Error(errorMessage);
      })
    );
  }
}
