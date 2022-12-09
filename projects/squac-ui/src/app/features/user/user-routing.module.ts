import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "@core/guards/auth.guard";
import { UserComponent } from "./components/user/user.component";
import { UserResolver } from "@core/resolvers/user.resolver";
import { OrganizationDetailComponent } from "./components/organization-detail/organization-detail.component";
import { OrganizationResolver } from "@core/resolvers/organization.resolver";
import { UserSettingsComponent } from "./components/user-settings/user-settings.component";
import { OrganizationsViewComponent } from "./components/organizations-view/organizations-view.component";
import { OrganizationEditEntryComponent } from "./components/organization-edit-entry/organization-edit-entry.component";

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
