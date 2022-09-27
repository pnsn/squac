import { Routes } from "@angular/router";
import { PermissionGuard } from "@core/guards/permission.guard";
import { WidgetMainComponent } from "./components/widget-main/widget-main.component";
import { WidgetResolver } from "@widget/widget.resolver";
import { WidgetEditEntryComponent } from "@widget/components/widget-edit/widget-edit-entry/widget-edit-entry.component";
import { MetricResolver } from "@metric/metric.resolver";
import { DashboardResolver } from "@features/dashboard/dashboard.resolver";

export const widgetRoutes: Routes = [
  {
    path: "",
    redirectTo: "widgets",
    pathMatch: "full",
  },
  {
    path: "widgets",
    component: WidgetMainComponent,
    resolve: {
      widgets: WidgetResolver,
      metrics: MetricResolver,
      dashboards: DashboardResolver,
    },
    runGuardsAndResolvers: "paramsOrQueryParamsChange",
    children: [
      {
        path: "new",
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        data: { subject: "Widget", action: "create" },
      },
      {
        path: ":widgetId/edit",
        resolve: {
          widget: WidgetResolver,
        },
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        data: { subject: "Widget", action: "update" },
      },
    ],
  },
];
