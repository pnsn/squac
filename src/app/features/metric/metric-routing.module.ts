import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "@core/guards/auth.guard";
import { PermissionGuard } from "@core/guards/permission.guard";
import { MetricComponent } from "./components/metric/metric.component";
import { MetricResolver } from "./metric.resolver";
import { MetricViewComponent } from "./components/metric-view/metric-view.component";
import { MetricEditComponent } from "./components/metric-edit/metric-edit.component";

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
      { path: "", component: MetricViewComponent, pathMatch: "full" },
      {
        path: "new",
        component: MetricEditComponent,
        canActivate: [PermissionGuard],
        data: { subject: "Metric", action: "create" },
      },
      // {
      //   path: ':id',
      //   component: MetricsViewComponent,
      //   canActivate: [PermissionGuard],
      //   data: {subject: 'Metric', action: 'read'}
      // },
      {
        path: ":metricId/edit",
        component: MetricEditComponent,
        canActivate: [PermissionGuard],
        data: { subject: "Metric", action: "update" },
        resolve: {
          metric: MetricResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetricRoutingModule {}
