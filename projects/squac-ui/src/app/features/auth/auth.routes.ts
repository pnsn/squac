import { Routes } from "@angular/router";
import { LoggedInGuard } from "@core/guards/logged-in.guard";

export const AUTH_ROUTES: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("@auth/pages/auth/auth.component").then((c) => c.AuthComponent),
    canActivate: [LoggedInGuard],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@auth/pages/login/login.component").then(
            (c) => c.LoginComponent
          ),
      },
      {
        path: "password-reset",
        loadComponent: () =>
          import("@auth/pages/password-reset/password-reset.component").then(
            (c) => c.PasswordResetComponent
          ),
      },
    ],
  },
  {
    path: "signup",
    loadComponent: () =>
      import("@auth/pages/auth/auth.component").then((c) => c.AuthComponent),
    canActivate: [LoggedInGuard],
    children: [
      {
        path: "",
        loadComponent: () =>
          import("@auth/pages/edit/user-edit.component").then(
            (c) => c.UserEditComponent
          ),
      },
    ],
  },
];
