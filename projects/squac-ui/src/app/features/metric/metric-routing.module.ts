import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "@core/guards/auth.guard";
import { MetricComponent } from "./components/metric/metric.component";
import { MetricResolver } from "@core/resolvers/metric.resolver";
import { MetricViewComponent } from "./components/metric-view/metric-view.component";
import { MetricEditEntryComponent } from "./components/metric-edit/metric-edit-entry/metric-edit-entry.component";

export const routes: Routes = [
  {
    path: "",
    component: MetricComponent,
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
            component: MetricEditEntryComponent,
          },
          {
            path: ":metricId/edit",
            component: MetricEditEntryComponent,
            resolve: {
              metric: MetricResolver,
            },
          },
        ],
      },
    ],
  },
];

/** Metric routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetricRoutingModule {}
