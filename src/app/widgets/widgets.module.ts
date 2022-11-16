import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { SquacapiModule } from "@squacapi/squacapi.module";
import { NgxEchartsModule } from "ngx-echarts";
import { CalendarComponent } from "./components/calendar";
import { MapComponent } from "./components/map";
import { ParallelPlotComponent } from "./components/parallel-plot";
import { ScatterPlotComponent } from "./components/scatter-plot";
import { TabularModule } from "./components/tabular";
import { TimechartComponent } from "./components/timechart";
import { TimelineComponent } from "./components/timeline";
import { WidgetTypeDirective } from "./directives/widget-type.directive";
import { PrecisionPipe } from "./pipes/precision.pipe";

@NgModule({
  declarations: [
    TimelineComponent,
    MapComponent,
    TimechartComponent,
    TimelineComponent,
    ScatterPlotComponent,
    ParallelPlotComponent,
    CalendarComponent,
    WidgetTypeDirective,
    PrecisionPipe,
  ],
  imports: [
    TabularModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    SquacapiModule,
    LeafletModule,
    CommonModule,
  ],
  exports: [WidgetTypeDirective],
  providers: [],
})
export class WidgetsModule {}
