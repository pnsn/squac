import { NgModule } from '@angular/core';
import { WidgetEditComponent } from '@features/widgets/components/widget-edit/widget-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';
import { WidgetsComponent } from '@features/widgets/components/widgets/widgets.component';
import { WidgetsResolver } from '@features/widgets/widgets.resolver';
import { WidgetEditEntryComponent } from '@features/widgets/components/widget-edit/widget-edit-entry/widget-edit-entry.component';
import { MetricsResolver } from '@features/metrics/metrics.resolver';
import { ChannelGroupsResolver } from '@features/channel-groups/channel-groups.resolver';
import { StatTypeResolver } from './stat-type.resolver';

export const widgetRoutes: Routes = [
  {
    path: '',
    redirectTo: 'widgets',
    pathMatch: 'full'
  },
  {
    path: 'widgets',
    component: WidgetsComponent,
    resolve: {
      widgets: WidgetsResolver
    },
    children: [
      {
        path: 'new',
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        resolve: {
          metrics: MetricsResolver,
          channelGroups: ChannelGroupsResolver,
          statTypes: StatTypeResolver,
        },
        data: {subject: 'Widget', action: 'create'}
      },
      // {
      //   path: ':widgetid',
      //   component: DashboardDetailComponent
      // },
      {
        path: ':widgetId/edit',
        resolve: {
          metrics: MetricsResolver,
          channelGroups: ChannelGroupsResolver,
          statTypes: StatTypeResolver,
        },
        component: WidgetEditEntryComponent,
        canActivate: [PermissionGuard],
        data: {subject: 'Widget', action: 'update'}
      },
    ]
  }
];
