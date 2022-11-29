import { NgModule } from "@angular/core";
import { DashboardComponent } from "./components/dashboard-main/dashboard.component";
import { DashboardDetailComponent } from "./components/dashboard-detail/dashboard-detail.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { PermissionGuard } from "@core/guards/permission.guard";
import { DashboardViewComponent } from "./components/dashboard-view/dashboard-view.component";
import { DashboardEditEntryComponent } from "./components/dashboard-edit/dashboard-edit-entry/dashboard-edit-entry.component";
import { ChannelGroupResolver } from "@squacapi/resolvers/channel-group.resolver";
import { DashboardResolver } from "@squacapi/resolvers/dashboard.resolver";
import { WidgetResolver } from "@squacapi/resolvers/widget.resolver";
import { MetricResolver } from "@squacapi/resolvers/metric.resolver";
import { WidgetEditEntryComponent } from "./components/widget-edit/widget-edit-entry/widget-edit-entry.component";
import { WidgetMainComponent } from "./components/widget-main/widget-main.component";

export const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    resolve: {
      dashboards: DashboardResolver,
    },
    children: [
      {
        path: "",
        component: DashboardViewComponent,
        canActivate: [PermissionGuard],
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
        resolve: {
          channelGroups: ChannelGroupResolver,
          dashboard: DashboardResolver,
        },
      },

      {
        path: ":dashboardId",
        component: DashboardDetailComponent,
        canActivate: [PermissionGuard],
        runGuardsAndResolvers: "paramsChange",
        resolve: {
          widgets: WidgetResolver,
          metrics: MetricResolver,
        },
        data: { subject: "Dashboard", action: "read" },
        children: [
          {
            path: "",
            redirectTo: "widgets",
            pathMatch: "full",
          },
          {
            path: "widgets",
            component: WidgetMainComponent,
            runGuardsAndResolvers: "paramsOrQueryParamsChange",
          },
          {
            path: "widgets/new",
            component: WidgetEditEntryComponent,
            canActivate: [PermissionGuard],
            data: { subject: "Widget", action: "create" },
          },
          {
            path: "widgets/:widgetId/edit",
            resolve: {
              widget: WidgetResolver,
            },
            component: WidgetEditEntryComponent,
            canActivate: [PermissionGuard],
            data: { subject: "Widget", action: "update" },
          },
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
