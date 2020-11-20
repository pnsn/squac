import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlarmsComponent } from './components/alarms/alarms.component';
import { AlarmEditComponent } from './components/alarm-edit/alarm-edit.component';
import { AlarmDetailComponent } from './components/alarm-detail/alarm-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: AlarmsComponent,
    children: [
      {
        path: 'new',
        component: AlarmEditComponent,
      },
      {
        path: ':id',
        component: AlarmDetailComponent
      },
      {
        path: ':id/edit',
        component: AlarmEditComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlarmsRoutingModule { }
