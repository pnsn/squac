import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MonitorComponent } from "./pages/main/monitor.component";
import { MonitorViewComponent } from "./pages/list/monitor-view.component";
import { AuthGuard } from "@core/guards/auth.guard";
import { MonitorEditEntryComponent } from "./pages/edit/monitor-edit-entry.component";
import { AlertViewComponent } from "./pages/alert-list/alert-view.component";
import { MonitorResolver } from "@core/resolvers/monitor.resolver";
import { MetricResolver } from "@core/resolvers/metric.resolver";
import { MonitorDetailComponent } from "./pages/detail/monitor-detail.component";
import { ChannelGroupResolver } from "@core/resolvers/channel-group.resolver";

export const MONITOR_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/main/monitor.component").then((c) => c.MonitorComponent),
    canActivate: [AuthGuard],
    resolve: {
      channelGroups: ChannelGroupResolver,
      metrics: MetricResolver,
    },
    children: [
      {
        path: "alerts",
        loadComponent: () =>
          import("./pages/alert-list/alert-view.component").then(
            (c) => c.AlertViewComponent
          ),
      },
      {
        path: "",
        loadComponent: () =>
          import("./pages/list/monitor-view.component").then(
            (c) => c.MonitorViewComponent
          ),
        runGuardsAndResolvers: "always",
        resolve: {
          monitors: MonitorResolver,
        },
        children: [
          {
            path: "new",
            loadComponent: () =>
              import("./pages/edit/monitor-edit-entry.component").then(
                (c) => c.MonitorEditEntryComponent
              ),
          },
        ],
      },
      {
        path: ":monitorId",
        loadComponent: () =>
          import("./pages/detail/monitor-detail.component").then(
            (c) => c.MonitorDetailComponent
          ),
        runGuardsAndResolvers: "always",
        children: [
          {
            path: "edit",
            loadComponent: () =>
              import("./pages/edit/monitor-edit-entry.component").then(
                (c) => c.MonitorEditEntryComponent
              ),
          },
        ],
        resolve: {
          monitor: MonitorResolver,
        },
      },
    ],
  },
];
