import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "@core/guards/auth.guard";
import { MetricComponent } from "./pages/main/metric.component";
import { MetricResolver } from "@core/resolvers/metric.resolver";
import { MetricViewComponent } from "./pages/list/metric-view.component";
import { MetricEditEntryComponent } from "./pages/edit/metric-edit-entry.component";

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
      {
        path: ":metricId",
        component: MetricViewComponent,
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
