import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorsComponent } from './components/monitors/monitors.component';
import { MonitorDetailComponent } from './components/monitor-detail/monitor-detail.component';
import { MonitorEditComponent } from './components/monitor-edit/monitor-edit.component';
import { MonitorViewComponent } from './components/monitor-view/monitor-view.component';
import { MonitorsRoutingModule } from './monitors-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MonitorChartComponent } from './components/monitor-chart/monitor-chart.component';
import { MonitorEditEntryComponent } from './components/monitor-edit-entry/monitor-edit-entry.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';



@NgModule({
  declarations: [MonitorsComponent, MonitorDetailComponent, MonitorEditComponent, MonitorViewComponent, MonitorChartComponent, MonitorEditEntryComponent],
  imports: [
    CommonModule,
    MonitorsRoutingModule,
    SharedModule,
    NgxChartsModule
  ]
})
export class MonitorsModule { }