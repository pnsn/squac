import { CalendarComponent } from "../components/calendar/calendar.component";
import { Calendar } from "../components/calendar/calendar.config";
import { MapComponent } from "../components/map/map.component";
import { Map } from "../components/map/map.config";
import { ParallelPlotComponent } from "../components/parallel-plot/parallel-plot.component";
import { Parallel } from "../components/parallel-plot/parallel-plot.config";
import { ScatterPlot } from "../components/scatter-plot/scatter-plot-config";
import { ScatterPlotComponent } from "../components/scatter-plot/scatter-plot.component";
import { TabularComponent } from "../components/tabular/tabular.component";
import { Tabular } from "../components/tabular/tabular.config";
import { TimechartComponent } from "../components/timechart/timechart.component";
import { TimeChart } from "../components/timechart/timechart.config";
import { TimelineComponent } from "../components/timeline/timeline.component";
import { Timeline } from "../components/timeline/timeline.config";
import { WidgetConfig } from "./widget-type";

export enum WidgetTypes {
  TABULAR = "tabular",
  TIMELINE = "timeline",
  TIMESERIES = "timeseries",
  MAP = "map",
  PARALLEL = "parallel-plot",
  SCATTER = "scatter-plot",
  CALENDAR = "calendar-plot",
}

type WidgetTypeInfo = {
  component: any;
  config: WidgetConfig;
};
/**
 * Associate widget types with the corresponding component
 */
export const WIDGET_TYPE_INFO: {
  [key in WidgetTypes]: WidgetTypeInfo;
} = {
  [WidgetTypes.TABULAR]: { component: TabularComponent, config: Tabular },
  [WidgetTypes.TIMELINE]: { component: TimelineComponent, config: Timeline },
  [WidgetTypes.TIMESERIES]: {
    component: TimechartComponent,
    config: TimeChart,
  },
  [WidgetTypes.MAP]: { component: MapComponent, config: Map },
  [WidgetTypes.PARALLEL]: {
    component: ParallelPlotComponent,
    config: Parallel,
  },
  [WidgetTypes.SCATTER]: {
    component: ScatterPlotComponent,
    config: ScatterPlot,
  },
  [WidgetTypes.CALENDAR]: { component: CalendarComponent, config: Calendar },
};
