import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError } from "rxjs/operators";

export const HttpErrorInterceptorFn: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
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
};
