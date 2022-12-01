import { NgModule } from "@angular/core";
import { ErrorComponent } from "./components/error/error.component";
import { SquacapiModule } from "squacapi";
import {
  Calendar,
  Map,
  Parallel,
  Scatter,
  Tabular,
  Timechart,
  Timeline,
} from "./components";
import { WidgetTypeDirective } from "./directives/widget-type.directive";

@NgModule({
  declarations: [WidgetTypeDirective, ErrorComponent],
  imports: [
    Tabular.TabularModule,
    Timeline.TimelineModule,
    Timechart.TimechartModule,
    Calendar.CalendarModule,
    Map.MapModule,
    Parallel.ParallelModule,
    Scatter.ScatterModule,
    SquacapiModule,
  ],
  exports: [WidgetTypeDirective],
  providers: [],
})
export class WidgetsModule {}
