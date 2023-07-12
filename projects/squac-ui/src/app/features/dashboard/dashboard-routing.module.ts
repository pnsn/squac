import { NgModule } from "@angular/core";
import { DashboardComponent } from "./pages/main/dashboard.component";
import { DashboardDetailComponent } from "./pages/detail/dashboard-detail.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { DashboardViewComponent } from "./pages/list/dashboard-view.component";
import { DashboardEditEntryComponent } from "./pages/edit/dashboard-edit-entry.component";
import { ChannelGroupResolver } from "@core/resolvers/channel-group.resolver";
import { DashboardResolver } from "@core/resolvers/dashboard.resolver";
import { WidgetMainComponent } from "./pages/widget-main/widget-main.component";
import { WidgetResolver } from "@core/resolvers/widget.resolver";
import { MetricResolver } from "@core/resolvers/metric.resolver";
import { WidgetEditEntryComponent } from "./pages/widget-edit/widget-edit-entry.component";

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
        runGuardsAndResolvers: "always",
        children: [
          {
            path: "new",
            component: DashboardEditEntryComponent,
          },
        ],
      },

      {
        path: ":dashboardId",
        component: DashboardDetailComponent,
        runGuardsAndResolvers: "paramsChange",
        resolve: {
          dashboard: DashboardResolver,
          widgets: WidgetResolver,
          metrics: MetricResolver,
        },
        children: [
          {
            path: "edit",
            component: DashboardEditEntryComponent,
            resolve: {
              channelGroups: ChannelGroupResolver,
              dashboard: DashboardResolver,
            },
          },
          {
            path: "",
            redirectTo: "widgets",
            pathMatch: "full",
          },
          {
            path: "widgets",
            component: WidgetMainComponent,
            runGuardsAndResolvers: "paramsOrQueryParamsChange",
            children: [
              {
                path: "new",
                component: WidgetEditEntryComponent,
              },
              {
                path: ":widgetId/edit",
                resolve: {
                  widget: WidgetResolver,
                },
                component: WidgetEditEntryComponent,
              },
            ],
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
