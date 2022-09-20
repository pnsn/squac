import { NgModule } from "@angular/core";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DashboardDetailComponent } from "./components/dashboard-detail/dashboard-detail.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { PermissionGuard } from "@core/guards/permission.guard";
import { widgetRoutes } from "@widget/widget.routes";
import { DashboardViewComponent } from "./components/dashboard-view/dashboard-view.component";
import { DashboardEditEntryComponent } from "./components/dashboard-edit/dashboard-edit-entry/dashboard-edit-entry.component";
import { ChannelGroupResolver } from "@features/channel-group/channel-group.resolver";

export const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        component: DashboardViewComponent,
        canActivate: [PermissionGuard],
        runGuardsAndResolvers: "always",
        children: [
          {
            path: "new",
            component: DashboardEditEntryComponent,
            canActivate: [PermissionGuard],
            data: { subject: "Dashboard", action: "create" },
          },
        ],
      },
      {
        path: ":dashboardId/edit",
        component: DashboardEditEntryComponent,
        canActivate: [PermissionGuard],
        data: { subject: "Dashboard", action: "update" },
        resolve: { channelGroups: ChannelGroupResolver },
      },

      {
        path: ":dashboardId",
        component: DashboardDetailComponent,
        canActivate: [PermissionGuard],
        runGuardsAndResolvers: "paramsChange",
        data: { subject: "Dashboard", action: "read" },
        children: [...widgetRoutes],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
