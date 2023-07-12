import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { UserResolver } from "@core/resolvers/user.resolver";
import { OrganizationDetailComponent } from "./pages/organization-detail/organization-detail.component";
import { OrganizationResolver } from "@core/resolvers/organization.resolver";
import { OrganizationEditEntryComponent } from "./pages/organization-edit/organization-edit-entry.component";

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
