import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { ChannelGroupResolver } from "@core/resolvers/channel-group.resolver";
import { DashboardResolver } from "@core/resolvers/dashboard.resolver";
import { WidgetResolver } from "@core/resolvers/widget.resolver";
import { MetricResolver } from "@core/resolvers/metric.resolver";

export const DASHBOARD_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/main/dashboard.component").then(
        (c) => c.DashboardComponent
      ),
    canActivate: [AuthGuard],
    resolve: {
      dashboards: DashboardResolver,
    },
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/list/dashboard-view.component").then(
            (c) => c.DashboardViewComponent
          ),
        runGuardsAndResolvers: "always",
        children: [
          {
            path: "new",
            loadComponent: () =>
              import("./pages/edit/dashboard-edit-entry.component").then(
                (c) => c.DashboardEditEntryComponent
              ),
          },
        ],
      },

      {
        path: ":dashboardId",
        loadComponent: () =>
          import("./pages/detail/dashboard-detail.component").then(
            (c) => c.DashboardDetailComponent
          ),
        runGuardsAndResolvers: "paramsChange",
        resolve: {
          dashboard: DashboardResolver,
          widgets: WidgetResolver,
          metrics: MetricResolver,
        },
        children: [
          {
            path: "edit",
            loadComponent: () =>
              import("./pages/edit/dashboard-edit-entry.component").then(
                (c) => c.DashboardEditEntryComponent
              ),
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
            loadComponent: () =>
              import("./pages/widget-main/widget-main.component").then(
                (c) => c.WidgetMainComponent
              ),
            runGuardsAndResolvers: "paramsOrQueryParamsChange",
            children: [
              {
                path: "new",
                loadComponent: () =>
                  import(
                    "./pages/widget-edit/widget-edit-entry.component"
                  ).then((c) => c.WidgetEditEntryComponent),
              },
              {
                path: ":widgetId/edit",
                resolve: {
                  widget: WidgetResolver,
                },
                loadComponent: () =>
                  import(
                    "./pages/widget-edit/widget-edit-entry.component"
                  ).then((c) => c.WidgetEditEntryComponent),
              },
            ],
          },
        ],
      },
    ],
  },
];
