import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlarmsComponent } from './components/alarms/alarms.component';
import { AlarmDetailComponent } from './components/alarm-detail/alarm-detail.component';
import { AlarmEditComponent } from './components/alarm-edit/alarm-edit.component';
import { AlarmViewComponent } from './components/alarm-view/alarm-view.component';
import { AlarmsRoutingModule } from './alarms-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AlarmChartComponent } from './components/alarm-chart/alarm-chart.component';
import { AlarmEditEntryComponent } from './components/alarm-edit-entry/alarm-edit-entry.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
  declarations: [AlarmsComponent, AlarmDetailComponent, AlarmEditComponent, AlarmViewComponent, AlarmChartComponent, AlarmEditEntryComponent],
  imports: [
    CommonModule,
    AlarmsRoutingModule,
    SharedModule,
    NgxChartsModule
  ]
})
export class AlarmsModule { }
