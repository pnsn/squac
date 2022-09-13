import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MonitorComponent } from "./components/monitor/monitor.component";
import { MonitorViewComponent } from "./components/monitor-view/monitor-view.component";
import { AuthGuard } from "@core/guards/auth.guard";
import { MonitorEditEntryComponent } from "./components/monitor-edit-entry/monitor-edit-entry.component";
import { AlertViewComponent } from "./components/alert-view/alert-view.component";

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
        runGuardsAndResolvers: "always",
        children: [
          {
            path: "new",
            component: MonitorEditEntryComponent,
          },
          {
            path: ":monitorId",
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
