import { NgModule } from "@angular/core";
import { DashboardsComponent } from "./components/dashboards/dashboards.component";
import { DashboardDetailComponent } from "./components/dashboard-detail/dashboard-detail.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { PermissionGuard } from "@core/guards/permission.guard";
import { DashboardsResolver } from "./dashboards.resolver";
import { widgetRoutes } from "@features/widgets/widgets.routes";
import { DashboardViewComponent } from "./components/dashboard-view/dashboard-view.component";
import { DashboardEditEntryComponent } from "./components/dashboard-edit/dashboard-edit-entry/dashboard-edit-entry.component";

export const routes: Routes = [
  {
    path: "",
    component: DashboardsComponent,
    canActivate: [AuthGuard],
    resolve: {
      dashboards: DashboardsResolver,
    },
    runGuardsAndResolvers: "always",
    children: [
      {
        path: "",
        component: DashboardViewComponent,
        canActivate: [PermissionGuard],
        resolve: {
          dashboards: DashboardsResolver,
        },
        children: [
          {
            path: "new",
            component: DashboardEditEntryComponent,
            canActivate: [PermissionGuard],
            data: { subject: "Dashboard", action: "create" },
          },
          // loadChildren: () => import('@features/widgets/widgets.module').then(m=>m.WidgetsModule)
        ],
      },
      {
        path: ":dashboardId",
        component: DashboardDetailComponent,
        canActivate: [PermissionGuard],
        data: { subject: "Dashboard", action: "read" },
        resolve: {
          dashboard: DashboardsResolver,
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
export class DashboardsRoutingModule {}
