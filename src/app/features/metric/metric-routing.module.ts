import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "@core/guards/auth.guard";
import { PermissionGuard } from "@core/guards/permission.guard";
import { MetricComponent } from "./components/metric/metric.component";
import { MetricResolver } from "./metric.resolver";
import { MetricViewComponent } from "./components/metric-view/metric-view.component";
import { MetricEditComponent } from "./components/metric-edit/metric-edit.component";
import { MetricEditEntryComponent } from "./metric-edit-entry/metric-edit-entry.component";

// TODO: fix this weird routing set up
export const routes: Routes = [
  {
    path: "",
    component: MetricComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { subject: "Metric", action: "read" },
    resolve: {
      metrics: MetricResolver,
    },
    runGuardsAndResolvers: "always",
    children: [
      {
        path: "",
        component: MetricViewComponent,
        resolve: {
          metrics: MetricResolver,
        },
        children: [
          {
            path: "new",
            component: MetricEditEntryComponent,
            canActivate: [PermissionGuard],
            data: { subject: "Metric", action: "create" },
          },
          {
            path: ":metricId/edit",
            component: MetricEditEntryComponent,
            canActivate: [PermissionGuard],
            data: { subject: "Metric", action: "update" },
            resolve: {
              metric: MetricResolver,
            },
          },
        ],
      },

      // {
      //   path: ":metricId",
      //   component: MetricDetailComponent,
      //   data: { subject: "Metric", action: "read" },
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetricRoutingModule {}
