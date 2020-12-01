import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlarmsComponent } from './components/alarms/alarms.component';
import { AlarmEditComponent } from './components/alarm-edit/alarm-edit.component';
import { AlarmDetailComponent } from './components/alarm-detail/alarm-detail.component';
import { AlarmViewComponent } from './components/alarm-view/alarm-view.component';
import { AlarmsResolver } from './alarms.resolver';
import { AuthGuard } from '@core/guards/auth.guard';
import { PermissionGuard } from '@core/guards/permission.guard';

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
        component: AlarmViewComponent
      },
      {
        path: 'new',
        // canActivate: [PermissionGuard],
        // data: {subject: 'Alarm', action: 'create'},
        component: AlarmEditComponent
      },
      {
        path: ':id',
        // canActivate: [PermissionGuard],
        // data: {subject: 'Alarm', action: 'create'},
        component: AlarmDetailComponent,
        resolve: {
          alarm: AlarmsResolver
        },
      },
      {
        path: ':id/edit',
        component: AlarmEditComponent,
        resolve: {
          alarm: AlarmsResolver
        },
        // canActivate: [PermissionGuard],
        // data: {subject: 'Alarm', action: 'create'},
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmsRoutingModule { }
