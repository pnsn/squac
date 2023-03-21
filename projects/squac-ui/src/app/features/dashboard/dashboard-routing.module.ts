import { NgModule } from "@angular/core";
import { DashboardComponent } from "./components/dashboard-main/dashboard.component";
import { DashboardDetailComponent } from "./components/dashboard-detail/dashboard-detail.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { DashboardViewComponent } from "./components/dashboard-view/dashboard-view.component";
import { DashboardEditEntryComponent } from "./components/dashboard-edit/dashboard-edit-entry/dashboard-edit-entry.component";
import { ChannelGroupResolver } from "@core/resolvers/channel-group.resolver";
import { DashboardResolver } from "@core/resolvers/dashboard.resolver";
import { WidgetMainComponent } from "./components/widget-main/widget-main.component";
import { WidgetResolver } from "@core/resolvers/widget.resolver";
import { MetricResolver } from "@core/resolvers/metric.resolver";
import { WidgetEditEntryComponent } from "./components/widget-edit/widget-edit-entry/widget-edit-entry.component";

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
        children: [
          {
            path: "new",
            component: DashboardEditEntryComponent,
            data: { subject: "Dashboard", action: "create" },
          },
        ],
      },
      {
        path: ":dashboardId/edit",
        component: DashboardEditEntryComponent,
        data: { subject: "Dashboard", action: "update" },
        resolve: {
          channelGroups: ChannelGroupResolver,
          dashboard: DashboardResolver,
        },
      },

      {
        path: ":dashboardId",
        component: DashboardDetailComponent,
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
          },
          {
            path: "widgets/:widgetId/edit",
            resolve: {
              widget: WidgetResolver,
            },
            component: WidgetEditEntryComponent,
          },
        ],
      },
    ],
  },
];

/** Dashboard routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
