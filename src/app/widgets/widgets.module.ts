import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { NgxDatatableModule } from "@boring.devs/ngx-datatable";
import { SquacapiModule } from "@squacapi/squacapi.module";
import { NgxEchartsModule } from "ngx-echarts";
import { CalendarComponent } from "./components/calendar/calendar.component";
import { MapComponent } from "./components/map/map.component";
import { ParallelPlotComponent } from "./components/parallel-plot/parallel-plot.component";
import { ScatterPlotComponent } from "./components/scatter-plot/scatter-plot.component";
import { TabularComponent } from "./components/tabular/tabular.component";
import { TimechartComponent } from "./components/timechart/timechart.component";
import { TimelineComponent } from "./components/timeline/timeline.component";
import { WidgetTypeDirective } from "./directives/widget-type.directive";
import { PrecisionPipe } from "./pipes/precision.pipe";

@NgModule({
  declarations: [
    TabularComponent,
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
    NgxDatatableModule,
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
