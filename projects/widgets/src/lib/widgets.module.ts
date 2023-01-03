import { NgModule } from "@angular/core";
import { ErrorComponent } from "./shared/components/error/error.component";
import { SquacapiModule } from "squacapi";
import {
  Calendar,
  Map,
  Parallel,
  Scatter,
  Tabular,
  Timechart,
  Timeline,
} from "./widget-types";
import { WidgetTypeDirective } from "./directives/widget-type.directive";

/**
 * Module for squac widgets
 */
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
