import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlarmsComponent } from './components/alarms/alarms.component';
import { AlarmDetailComponent } from './components/alarm-detail/alarm-detail.component';
import { AlarmEditComponent } from './components/alarm-edit/alarm-edit.component';
import { AlarmViewComponent } from './components/alarm-view/alarm-view.component';
import { AlarmsRoutingModule } from './alarms-routing.module';



@NgModule({
  declarations: [AlarmsComponent, AlarmDetailComponent, AlarmEditComponent, AlarmViewComponent],
  imports: [
    CommonModule,
    AlarmsRoutingModule
  ]
})
export class AlarmsModule { }
