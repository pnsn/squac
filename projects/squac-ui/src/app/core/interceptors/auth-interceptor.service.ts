import { inject } from "@angular/core";
import { HttpHeaders, HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "../services/auth.service";

// After
export const AuthInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // if user is logged in, add headers
  if (authService.isAuthenticated()) {
    const modifiedReq = req.clone({
      headers: new HttpHeaders({
        Authorization: `Token ${authService.auth}`,
      }),
    });
    return next(modifiedReq);
  }

  return next(req);
};
