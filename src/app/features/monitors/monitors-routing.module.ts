import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorsComponent } from './components/monitors/monitors.component';
import { MonitorEditComponent } from './components/monitor-edit/monitor-edit.component';
import { MonitorDetailComponent } from './components/monitor-detail/monitor-detail.component';
import { MonitorViewComponent } from './components/monitor-view/monitor-view.component';
import { MonitorsResolver } from './monitors.resolver';
import { AuthGuard } from '@core/guards/auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';
import { ChannelGroupsResolver } from '@features/channel-groups/channel-groups.resolver';
import { MetricsResolver } from '@features/metrics/metrics.resolver';
import { MonitorEditEntryComponent } from './components/monitor-edit-entry/monitor-edit-entry.component';

export const routes: Routes = [
  {
    path: '',
    component: MonitorsComponent,
    canActivate:[AuthGuard],
    // data: {subject: 'Monitor', action: 'read'}
    resolve: {
      monitors: MonitorsResolver
    },
    children: [
      {
        path: '',
        // canActivate: [PermissionGuard],
        // data: {subject: 'Monitor', action: 'read'},
        component: MonitorViewComponent,
        children: [
          {
            path: 'new',
            // canActivate: [PermissionGuard],
            // data: {subject: 'Monitor', action: 'create'},
            component: MonitorEditEntryComponent,
            resolve: {
              channelGroups: ChannelGroupsResolver,
              metrics: MetricsResolver
            },
          },
          {
            path: ':monitorId',
            // canActivate: [PermissionGuard],
            // data: {subject: 'Monitor', action: 'create'},
            component: MonitorDetailComponent,
            resolve: {
              monitor: MonitorsResolver
            },
            children: [
              {
                path: 'edit',
                component: MonitorEditEntryComponent,
                resolve: {
                  channelGroups: ChannelGroupsResolver,
                  metrics: MetricsResolver
                },
                // canActivate: [PermissionGuard],
                // data: {subject: 'Monitor', action: 'create'},
              }
            ]
          }

        ]
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorsRoutingModule { }