import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MonitorComponent } from "./components/monitor/monitor.component";
import { MonitorViewComponent } from "./components/monitor-view/monitor-view.component";
import { MonitorResolver } from "./monitor.resolver";
import { AuthGuard } from "@core/guards/auth.guard";
import { ChannelGroupResolver } from "@features/channel-group/channel-group.resolver";
import { MetricResolver } from "@features/metric/metric.resolver";
import { MonitorEditEntryComponent } from "./components/monitor-edit-entry/monitor-edit-entry.component";
import { AlertViewComponent } from "./components/alert-view/alert-view.component";
import { AlertsResolver } from "./alert.resolver";

export const routes: Routes = [
  {
    path: "",
    component: MonitorComponent,
    canActivate: [AuthGuard],
    // data: {subject: 'Monitor', action: 'read'}
    resolve: {
      monitors: MonitorResolver,
      alerts: AlertsResolver,
    },
    runGuardsAndResolvers: "always",
    children: [
      {
        path: "alerts",
        component: AlertViewComponent,
      },
      {
        path: "",
        // canActivate: [PermissionGuard],
        // data: {subject: 'Monitor', action: 'read'},
        component: MonitorViewComponent,
        children: [
          {
            path: "new",
            // canActivate: [PermissionGuard],
            // data: {subject: 'Monitor', action: 'create'},
            component: MonitorEditEntryComponent,
            resolve: {
              channelGroups: ChannelGroupResolver,
              metrics: MetricResolver,
            },
          },
          {
            path: ":monitorId",
            // canActivate: [PermissionGuard],
            // data: {subject: 'Monitor', action: 'create'},
            resolve: {
              monitor: MonitorResolver,
            },
            children: [
              {
                path: "edit",
                component: MonitorEditEntryComponent,
                resolve: {
                  channelGroups: ChannelGroupResolver,
                  metrics: MetricResolver,
                },
                // canActivate: [PermissionGuard],
                // data: {subject: 'Monitor', action: 'create'},
              },
            ],
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
export class MonitorRoutingModule {}
