import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MonitorComponent } from "./components/monitor/monitor.component";
import { MonitorEditComponent } from "./components/monitor-edit/monitor-edit.component";
import { MonitorViewComponent } from "./components/monitor-view/monitor-view.component";
import { MonitorRoutingModule } from "./monitor-routing.module";
import { SharedModule } from "@shared/shared.module";
import { MonitorEditEntryComponent } from "./components/monitor-edit-entry/monitor-edit-entry.component";
import { AlertViewComponent } from "./components/alert-view/alert-view.component";
import { AbilityModule } from "@casl/angular";
import { MonitorDetailComponent } from "./components/monitor-detail/monitor-detail.component";
import { MonitorHistoryChartComponent } from "./components/monitor-detail/monitor-history-chart/monitor-history-chart.component";
import { WidgetsModule } from "widgets";
import { NgxEchartsModule } from "ngx-echarts";
import { MonitorAlarmStatusComponent } from "./components/monitor-alarm-status/monitor-alarm-status.component";
import { MonitorChannelHistoryChartComponent } from "./components/monitor-detail/monitor-channel-history-chart copy/monitor-channel-history-chart.component";

/**
 * Module for monitors
 */
@NgModule({
  declarations: [
    MonitorComponent,
    MonitorEditComponent,
    MonitorDetailComponent,
    MonitorViewComponent,
    MonitorEditEntryComponent,
    AlertViewComponent,
    MonitorHistoryChartComponent,
    MonitorChannelHistoryChartComponent,
    MonitorAlarmStatusComponent,
  ],
  imports: [
    CommonModule,
    MonitorRoutingModule,
    SharedModule,
    AbilityModule,
    WidgetsModule,
    NgxEchartsModule,
  ],
})
export class MonitorModule {}
