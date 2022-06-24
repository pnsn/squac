import { NgModule } from "@angular/core";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DashboardDetailComponent } from "./components/dashboard-detail/dashboard-detail.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { PermissionGuard } from "@core/guards/permission.guard";
import { DashboardResolver } from "./dashboard.resolver";
import { widgetRoutes } from "@widget/widget.routes";
import { DashboardViewComponent } from "./components/dashboard-view/dashboard-view.component";
import { DashboardEditEntryComponent } from "./components/dashboard-edit/dashboard-edit-entry/dashboard-edit-entry.component";

export const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    children: [
      {
        path: "",
        component: DashboardViewComponent,
        canActivate: [PermissionGuard],
        resolve: {
          dashboards: DashboardResolver,
        },
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
        path: ":dashboardId",
        component: DashboardDetailComponent,
        canActivate: [PermissionGuard],
        data: { subject: "Dashboard", action: "read" },
        resolve: {
          dashboard: DashboardResolver,
        },
        children: [
          {
            path: "edit",
            component: DashboardEditEntryComponent,
            canActivate: [PermissionGuard],
            data: { subject: "Dashboard", action: "update" },
          },
          ...widgetRoutes,
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
