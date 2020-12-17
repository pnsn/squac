import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlarmsComponent } from './components/alarms/alarms.component';
import { AlarmEditComponent } from './components/alarm-edit/alarm-edit.component';
import { AlarmDetailComponent } from './components/alarm-detail/alarm-detail.component';
import { AlarmViewComponent } from './components/alarm-view/alarm-view.component';
import { AlarmsResolver } from './alarms.resolver';
import { AuthGuard } from '@core/guards/auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';
import { ChannelGroupsResolver } from '@features/channel-groups/channel-groups.resolver';
import { MetricsResolver } from '@features/metrics/metrics.resolver';
import { AlarmEditEntryComponent } from './components/alarm-edit-entry/alarm-edit-entry.component';

export const routes: Routes = [
  {
    path: '',
    component: AlarmsComponent,
    canActivate:[AuthGuard],
    // data: {subject: 'Alarm', action: 'read'}
    resolve: {
      alarms: AlarmsResolver
    },
    children: [
      {
        path: '',
        // canActivate: [PermissionGuard],
        // data: {subject: 'Alarm', action: 'read'},
        component: AlarmViewComponent,
        children: [
          {
            path: 'new',
            // canActivate: [PermissionGuard],
            // data: {subject: 'Alarm', action: 'create'},
            component: AlarmEditEntryComponent,
            resolve: {
              channelGroups: ChannelGroupsResolver,
              metrics: MetricsResolver
            },
          },
          {
            path: ':alarmId',
            // canActivate: [PermissionGuard],
            // data: {subject: 'Alarm', action: 'create'},
            component: AlarmDetailComponent,
            resolve: {
              alarm: AlarmsResolver
            },
            children: [
              {
                path: 'edit',
                component: AlarmEditEntryComponent,
                resolve: {
                  channelGroups: ChannelGroupsResolver,
                  metrics: MetricsResolver
                },
                // canActivate: [PermissionGuard],
                // data: {subject: 'Alarm', action: 'create'},
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
export class AlarmsRoutingModule { }
