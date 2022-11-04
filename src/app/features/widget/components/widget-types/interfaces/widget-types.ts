import { CalendarComponent } from "../calendar/calendar.component";
import { MapComponent } from "../map/map.component";
import { ParallelPlotComponent } from "../parallel-plot/parallel-plot.component";
import { ScatterPlotComponent } from "../scatter-plot/scatter-plot.component";
import { TabularComponent } from "../tabular/tabular.component";
import { TimechartComponent } from "../timechart/timechart.component";
import { TimelineComponent } from "../timeline/timeline.component";

export const widgetTypeComponents = {
  map: MapComponent,
  "calendar-plot": CalendarComponent,
  "parallel-plot": ParallelPlotComponent,
  "scatter-plot": ScatterPlotComponent,
  tabular: TabularComponent,
  timeline: TimelineComponent,
  timeseries: TimechartComponent,
};
