import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { UserResolver } from "@core/pages/resolvers/user.resolver";
import { OrganizationResolver } from "@core/pages/resolvers/organization.resolver";

export const USER_ROUTES: Routes = [
  {
    path: "",
    resolve: {
      user: UserResolver,
    },
    canActivate: [AuthGuard],
    loadComponent: () =>
      import("./pages/main/user.component").then((c) => c.UserComponent),
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "settings",
      },
      {
        path: "settings",
        loadComponent: () =>
          import("./pages/detail/user-settings.component").then(
            (c) => c.UserSettingsComponent
          ),
      },
      {
        path: "organizations",
        loadComponent: () =>
          import("./pages/organization-list/organizations-view.component").then(
            (c) => c.OrganizationsViewComponent
          ),
        resolve: {
          organizations: OrganizationResolver,
        },
      },
      {
        path: "organizations/:orgId",
        loadComponent: () =>
          import(
            "./pages/organization-detail/organization-detail.component"
          ).then((c) => c.OrganizationDetailComponent),
        runGuardsAndResolvers: "always",
        resolve: {
          organization: OrganizationResolver,
        },
        children: [
          {
            path: "user/:userId/edit",
            loadComponent: () =>
              import(
                "./pages/organization-edit/organization-edit-entry.component"
              ).then((c) => c.OrganizationEditEntryComponent),
          },
          {
            path: "user/new",
            loadComponent: () =>
              import(
                "./pages/organization-edit/organization-edit-entry.component"
              ).then((c) => c.OrganizationEditEntryComponent),
          },
        ],
      },
    ],
  },
];
