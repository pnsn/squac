import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "@core/guards/auth.guard";
import { PermissionGuard } from "@core/guards/permission.guard";
import { MetricComponent } from "./components/metric/metric.component";
import { MetricResolver } from "@squacapi/resolvers/metric.resolver";
import { MetricViewComponent } from "./components/metric-view/metric-view.component";
import { MetricEditEntryComponent } from "./components/metric-edit/metric-edit-entry/metric-edit-entry.component";

export const routes: Routes = [
  {
    path: "",
    component: MetricComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { subject: "Metric", action: "read" },
    children: [
      {
        path: "",
        component: MetricViewComponent,
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetricRoutingModule {}
