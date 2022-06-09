import { NgModule } from "@angular/core";
import { WidgetDetailComponent } from "./components/widget-detail/widget-detail.component";
import { WidgetEditComponent } from "./components/widget-edit/widget-edit.component";
import { MeasurementPipe } from "./pipes/measurement.pipe";
import { TabularComponent } from "./components/widget-types/tabular/tabular.component";
import { TimelineComponent } from "./components/widget-types/timeline/timeline.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { GridsterModule } from "angular-gridster2";
import { WidgetEditOptionsComponent } from "./components/widget-edit/widget-edit-options/widget-edit-options.component";
import { WidgetEditMetricsComponent } from "./components/widget-edit/widget-edit-metrics/widget-edit-metrics.component";
import { WidgetEditChannelGroupComponent } from "./components/widget-edit/widget-edit-channel-group/widget-edit-channel-group.component";
import { SharedModule } from "@shared/shared.module";
import { WidgetMainComponent } from "./components/widget-main/widget-main.component";
import { WidgetEditEntryComponent } from "./components/widget-edit/widget-edit-entry/widget-edit-entry.component";
import { MapComponent } from "./components/widget-types/map/map.component";
import { WidgetEditInfoComponent } from "./components/widget-edit/widget-edit-info/widget-edit-info.component";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { TimechartComponent } from "./components/widget-types/timechart/timechart.component";
import { ScatterPlotComponent } from "./components/widget-types/scatter-plot/scatter-plot.component";
import { BoxPlotComponent } from "./components/widget-types/box-plot/box-plot.component";
import { ParallelPlotComponent } from "./components/widget-types/parallel-plot/parallel-plot.component";

@NgModule({
  declarations: [
    WidgetMainComponent,
    WidgetDetailComponent,
    WidgetEditComponent,
    TabularComponent,
    TimelineComponent,
    WidgetEditOptionsComponent,
    MeasurementPipe,
    WidgetEditMetricsComponent,
    WidgetEditChannelGroupComponent,
    WidgetEditEntryComponent,
    MapComponent,
    WidgetEditInfoComponent,
    TimechartComponent,
    TimelineComponent,
    ScatterPlotComponent,
    BoxPlotComponent,
    ParallelPlotComponent,
  ],
  imports: [SharedModule, NgxChartsModule, GridsterModule],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class WidgetModule {}
