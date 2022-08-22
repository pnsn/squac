import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MonitorComponent } from "./components/monitor/monitor.component";
import { MonitorViewComponent } from "./components/monitor-view/monitor-view.component";
import { MonitorResolver } from "./monitor.resolver";
import { AuthGuard } from "@core/guards/auth.guard";
import { MonitorEditEntryComponent } from "./components/monitor-edit-entry/monitor-edit-entry.component";
import { AlertViewComponent } from "./components/alert-view/alert-view.component";
import { AlertResolver } from "./alert.resolver";

export const routes: Routes = [
  {
    path: "",
    component: MonitorComponent,
    canActivate: [AuthGuard],
    resolve: {
      monitors: MonitorResolver,
      alerts: AlertResolver,
    },
    children: [
      {
        path: "alerts",
        component: AlertViewComponent,
      },
      {
        path: "",
        component: MonitorViewComponent,
        resolve: {
          monitors: MonitorResolver,
          alerts: AlertResolver,
        },
        runGuardsAndResolvers: "always",
        children: [
          {
            path: "new",
            component: MonitorEditEntryComponent,
          },
          {
            path: ":monitorId",
            resolve: {
              monitor: MonitorResolver,
            },
            children: [
              {
                path: "edit",
                component: MonitorEditEntryComponent,
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
