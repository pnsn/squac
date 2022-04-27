import { Routes } from "@angular/router";
import { PermissionGuard } from "@core/guards/permission.guard";
import { WidgetMainComponent } from "./components/widget-main/widget-main.component";
import { WidgetResolver } from "@features/widget/widget.resolver";
import { WidgetEditEntryComponent } from "@features/widget/components/widget-edit/widget-edit-entry/widget-edit-entry.component";
import { MetricResolver } from "@features/metric/metric.resolver";
import { ChannelGroupsResolver } from "@features/channel-groups/channel-groups.resolver";
import { StatTypeResolver } from "./stat-type.resolver";

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
    runGuardsAndResolvers: "always",
    children: [
      {
        path: "new",
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        resolve: {
          metrics: MetricResolver,
          channelGroups: ChannelGroupsResolver,
          statTypes: StatTypeResolver,
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
          metrics: MetricResolver,
          channelGroups: ChannelGroupsResolver,
          statTypes: StatTypeResolver,
        },
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        data: { subject: "Widget", action: "update" },
      },
    ],
  },
];
