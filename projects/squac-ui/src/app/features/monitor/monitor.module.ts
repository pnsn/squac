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
import { MonitorChannelHistoryChartComponent } from "./components/monitor-detail/monitor-channel-history-chart/monitor-channel-history-chart.component";
import { TooltipModule } from "@ui/tooltip/tooltip.module";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatOptionModule } from "@angular/material/core";

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
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatStepperModule,
    MatOptionModule,
    MatFormFieldModule,
    CommonModule,
    MonitorRoutingModule,
    SharedModule,
    AbilityModule,
    WidgetsModule,
    NgxEchartsModule,
    TooltipModule,
    LoadingDirective,
  ],
})
export class MonitorModule {}
