import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { UserResolver } from "@core/pages/resolvers/user.resolver";
import { OrganizationResolver } from "@core/pages/resolvers/organization.resolver";
import { NotFoundComponent } from "@core/pages/not-found/not-found.component";
import { LoggedInGuard } from "@core/guards/logged-in.guard";

export const APP_ROUTES: Routes = [
  {
    path: "password_reset/confirm",
    redirectTo: "login/password-reset",
    pathMatch: "full",
  },
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
  {
    path: "",
    loadComponent: () =>
      import("@core/pages/home/home.component").then((c) => c.HomeComponent),
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      organizations: OrganizationResolver,
    },
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "dashboards",
      },
      {
        path: "dashboards",
        loadChildren: () =>
          import("@dashboard/dashboard.routes").then((r) => r.DASHBOARD_ROUTES),
      },
      {
        path: "channel-groups",
        loadChildren: () =>
          import("@channelGroup/channel-group.routes").then(
            (r) => r.CHANNEL_GROUP_ROUTES
          ),
      },
      {
        path: "metrics",
        loadChildren: () =>
          import("@metric/metric.routes").then((r) => r.METRIC_ROUTES),
      },
      {
        path: "user",
        loadChildren: () =>
          import("@user/user.routes").then((m) => m.USER_ROUTES),
      },
      {
        path: "monitors",
        loadChildren: () =>
          import("@monitor/monitor.routes").then((r) => r.MONITOR_ROUTES),
      },
      { path: "not-found", component: NotFoundComponent, pathMatch: "full" },
      { path: "**", redirectTo: "not-found" },
    ],
  },
];
