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

export const routes: Routes = [
  {
    path: "",
    component: MonitorComponent,
    canActivate: [AuthGuard],
    resolve: {
      channelGroups: ChannelGroupResolver,
      metrics: MetricResolver,
    },
    children: [
      {
        path: "alerts",
        component: AlertViewComponent,
      },
      {
        path: "",
        component: MonitorViewComponent,
        runGuardsAndResolvers: "always",
        resolve: {
          monitors: MonitorResolver,
        },
        children: [
          {
            path: "new",
            component: MonitorEditEntryComponent,
          },
        ],
      },
      {
        path: ":monitorId",
        component: MonitorDetailComponent,
        runGuardsAndResolvers: "always",
        children: [
          {
            path: "edit",
            component: MonitorEditEntryComponent,
          },
        ],
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
