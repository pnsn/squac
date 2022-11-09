import { CalendarComponent } from "../components/calendar/calendar.component";
import { MapComponent } from "../components/map/map.component";
import { ParallelPlotComponent } from "../components/parallel-plot/parallel-plot.component";
import { ScatterPlotComponent } from "../components/scatter-plot/scatter-plot.component";
import { TabularComponent } from "../components/tabular/tabular.component";
import { TimechartComponent } from "../components/timechart/timechart.component";
import { TimelineComponent } from "../components/timeline/timeline.component";

export const widgetTypeComponents = {
  map: MapComponent,
  "calendar-plot": CalendarComponent,
  "parallel-plot": ParallelPlotComponent,
  "scatter-plot": ScatterPlotComponent,
  tabular: TabularComponent,
  timeline: TimelineComponent,
  timeseries: TimechartComponent,
};
