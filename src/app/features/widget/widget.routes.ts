import { Routes } from "@angular/router";
import { PermissionGuard } from "@core/guards/permission.guard";
import { WidgetMainComponent } from "./components/widget-main/widget-main.component";
import { WidgetResolver } from "@widget/widget.resolver";
import { WidgetEditEntryComponent } from "@widget/components/widget-edit/widget-edit-entry/widget-edit-entry.component";
import { MetricResolver } from "@metric/metric.resolver";
import { ChannelGroupResolver } from "@channelGroup/channel-group.resolver";

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
    },
    runGuardsAndResolvers: "paramsOrQueryParamsChange",
    children: [
      {
        path: "new",
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        resolve: {
          metrics: MetricResolver,
          channelGroups: ChannelGroupResolver,
        },
        data: { subject: "Widget", action: "create" },
      },
      // {
      //   path: ':widgetid',
      //   component: DashboardDetailComponent
      // },
      {
        path: ":widgetId/edit",
        resolve: {
          widget: WidgetResolver,
          metrics: MetricResolver,
          channelGroups: ChannelGroupResolver,
        },
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        data: { subject: "Widget", action: "update" },
      },
    ],
  },
];
