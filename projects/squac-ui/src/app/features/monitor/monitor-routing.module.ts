import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MonitorComponent } from "./components/monitor/monitor.component";
import { MonitorViewComponent } from "./components/monitor-view/monitor-view.component";
import { AuthGuard } from "@core/guards/auth.guard";
import { MonitorEditEntryComponent } from "./components/monitor-edit-entry/monitor-edit-entry.component";
import { AlertViewComponent } from "./components/alert-view/alert-view.component";
import { MonitorResolver } from "@core/resolvers/monitor.resolver";
import { MetricResolver } from "@core/resolvers/metric.resolver";
import { ChannelGroupResolver } from "@core/resolvers/channel-group.resolver";
import { MonitorDetailComponent } from "./components/monitor-detail/monitor-detail.component";

export const routes: Routes = [
  {
    path: "",
    component: MonitorComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "alerts",
        component: AlertViewComponent,
      },
      {
        path: "",
        component: MonitorViewComponent,

        children: [
          {
            path: "new",
            component: MonitorEditEntryComponent,
            resolve: {
              metrics: MetricResolver,
              channelGroups: ChannelGroupResolver,
            },
          },
          {
            path: ":monitorId/edit",
            component: MonitorEditEntryComponent,
            resolve: {
              monitor: MonitorResolver,
              metrics: MetricResolver,
              channelGroups: ChannelGroupResolver,
            },
          },
        ],
      },
      {
        path: ":monitorId",
        component: MonitorDetailComponent,
        resolve: {
          monitor: MonitorResolver,
        },
      },
    ],
  },
];

/** Monitors routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitorRoutingModule {}
