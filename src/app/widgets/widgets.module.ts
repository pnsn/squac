import { NgModule } from "@angular/core";
import { CalendarModule } from "./components/calendar";
import { MapModule } from "./components/map";
import { ParallelModule } from "./components/parallel-plot";
import { ScatterModule } from "./components/scatter-plot";
import { TabularModule } from "./components/tabular";
import { TimechartModule } from "./components/timechart";
import { TimelineModule } from "./components/timeline";
import { WidgetTypeDirective } from "./directives/widget-type.directive";

@NgModule({
  declarations: [WidgetTypeDirective],
  imports: [
    TabularModule,
    TimelineModule,
    TimechartModule,
    CalendarModule,
    MapModule,
    ParallelModule,
    ScatterModule,
  ],
  exports: [WidgetTypeDirective],
  providers: [],
})
export class WidgetsModule {}
