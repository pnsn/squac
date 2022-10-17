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

// Intercepts and formats http error responses for uniformity
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
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
          errorMessage = "Error: " + error.error.message;
        } else if (typeof error.error === "string") {
          // server-side error
          errorMessage = "Error: " + error.error;
        } else if (error.error instanceof Object) {
          const keys = Object.keys(error.error);
          if (keys) {
            errorMessage = "Error: ";
            for (const errorMsg of keys) {
              errorMessage += errorMsg + " " + error.error[errorMsg];
            }
          }
        }
        throw new Error(errorMessage);
      })
    );
  }
}
