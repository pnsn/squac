import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./core/components/auth/auth.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { LoggedInGuard } from "./core/guards/logged-in.guard";
import { PasswordResetComponent } from "@features/user/components/password-reset/password-reset.component";
import { LoginComponent } from "@features/user/components/login/login.component";
import { UserEditComponent } from "@features/user/components/user-edit/user-edit.component";
import { UserResolver } from "@features/user/user.resolver";
import { OrganizationResolver } from "@features/user/organization.resolver";
import { MetricResolver } from "@features/metric/metric.resolver";
import { NotFoundComponent } from "@core/components/not-found/not-found.component";
import { HomeComponent } from "@core/components/home/home.component";
import { DashboardResolver } from "@features/dashboard/dashboard.resolver";
import { ChannelGroupResolver } from "@features/channel-group/channel-group.resolver";
import { StatTypeResolver } from "@features/widget/stat-type.resolver";

const appRoutes: Routes = [
  {
    path: "password_reset/confirm",
    redirectTo: "login/password-reset",
    pathMatch: "full",
  },
  {
    path: "login",
    component: AuthComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: "",
        component: LoginComponent,
      },
      {
        path: "password-reset",
        component: PasswordResetComponent,
      },
    ],
  },
  {
    path: "signup",
    component: AuthComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: "",
        component: UserEditComponent,
      },
    ],
  },
  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard],
    resolve: {
      dashboards: DashboardResolver,
      channelGroups: ChannelGroupResolver,
      metrics: MetricResolver,
      user: UserResolver,
      statType: StatTypeResolver,
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
          import("@features/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "channel-groups",
        loadChildren: () =>
          import("@features/channel-group/channel-group.module").then(
            (m) => m.ChannelGroupModule
          ),
      },
      {
        path: "metrics",
        loadChildren: () =>
          import("@features/metric/metric.module").then((m) => m.MetricModule),
      },
      {
        path: "user",
        loadChildren: () =>
          import("@features/user/user.module").then((m) => m.UserModule),
      },
      {
        path: "monitors",
        loadChildren: () =>
          import("@features/monitor/monitor.module").then(
            (m) => m.MonitorModule
          ),
      },
      { path: "not-found", component: NotFoundComponent, pathMatch: "full" },
      { path: "**", redirectTo: "not-found" },
    ],
  },
  // Currently overrides the child components - will need to rethink
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { relativeLinkResolution: "legacy" }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
