import { Routes } from "@angular/router";
import { PermissionGuard } from "@core/guards/permission.guard";
import { WidgetMainComponent } from "./components/widget-main/widget-main.component";
import { WidgetsResolver } from "@features/widgets/widgets.resolver";
import { WidgetEditEntryComponent } from "@features/widgets/components/widget-edit/widget-edit-entry/widget-edit-entry.component";
import { MetricsResolver } from "@features/metrics/metrics.resolver";
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
      widgets: WidgetsResolver,
    },
    runGuardsAndResolvers: "always",
    children: [
      {
        path: "new",
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        resolve: {
          metrics: MetricsResolver,
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
          metrics: MetricsResolver,
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
