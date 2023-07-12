import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "@core/guards/auth.guard";
import { UserComponent } from "./pages/main/user.component";
import { UserResolver } from "@core/resolvers/user.resolver";
import { OrganizationDetailComponent } from "./pages/organization-detail/organization-detail.component";
import { OrganizationResolver } from "@core/resolvers/organization.resolver";
import { UserSettingsComponent } from "./pages/user-settings/user-settings.component";
import { OrganizationsViewComponent } from "./pages/organization-list/organizations-view.component";
import { OrganizationEditEntryComponent } from "./pages/organization-edit-entry/organization-edit-entry.component";

// TODO: fix this weird routing set up
export const routes: Routes = [
  {
    path: "",
    resolve: {
      user: UserResolver,
    },
    canActivate: [AuthGuard],
    component: UserComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "settings",
      },
      {
        path: "settings",
        component: UserSettingsComponent,
      },
      {
        path: "organizations",
        component: OrganizationsViewComponent,
        resolve: {
          organizations: OrganizationResolver,
        },
      },
      {
        path: "organizations/:orgId",

        component: OrganizationDetailComponent,
        runGuardsAndResolvers: "always",
        resolve: {
          organization: OrganizationResolver,
        },
        children: [
          {
            path: "user/:userId/edit",
            component: OrganizationEditEntryComponent,
          },
          {
            path: "user/new",
            component: OrganizationEditEntryComponent,
          },
        ],
      },
    ],
  },
];

/**
 * Module for user feature
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
