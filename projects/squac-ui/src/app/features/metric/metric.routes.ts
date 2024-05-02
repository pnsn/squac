import { Routes } from "@angular/router";
import { AuthGuard } from "@core/guards/auth.guard";
import { MetricResolver } from "@core/resolvers/metric.resolver";
import { MetricViewComponent } from "./pages/list/metric-view.component";

export const METRIC_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/main/metric.component").then((c) => c.MetricComponent),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: "always",
    resolve: {
      metrics: MetricResolver,
    },
    children: [
      {
        path: "",
        component: MetricViewComponent,
        children: [
          {
            path: "new",
            loadComponent: () =>
              import("./pages/edit/metric-edit-entry.component").then(
                (c) => c.MetricEditEntryComponent
              ),
          },
          {
            path: ":metricId/edit",
            loadComponent: () =>
              import("./pages/edit/metric-edit-entry.component").then(
                (c) => c.MetricEditEntryComponent
              ),
            resolve: {
              metric: MetricResolver,
            },
          },
        ],
      },
      {
        path: ":metricId",
        loadComponent: () =>
          import("./pages/list/metric-view.component").then(
            (c) => c.MetricViewComponent
          ),
      },
    ],
  },
];
