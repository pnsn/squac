import {
  Calendar,
  Map,
  Parallel,
  Scatter,
  Tabular,
  Timechart,
  Timeline,
} from "../components";
import { WidgetType } from "../enums";
import { WidgetConfig } from "../interfaces";

export type WidgetTypeInfo = {
  component: any;
  config: WidgetConfig;
};
/**
 * Associate widget types with the corresponding component
 */
export const WIDGET_TYPE_INFO: {
  [key in WidgetType]: WidgetTypeInfo;
} = {
  [WidgetType.TABULAR]: Tabular.WIDGET_INFO,
  [WidgetType.TIMELINE]: {
    component: Timeline.TimelineComponent,
    config: Timeline.CONFIG,
  },
  [WidgetType.TIMESERIES]: {
    component: Timechart.TimechartComponent,
    config: Timechart.CONFIG,
  },
  [WidgetType.MAP]: { component: Map.MapComponent, config: Map.CONFIG },
  [WidgetType.PARALLEL]: {
    component: Parallel.ParallelPlotComponent,
    config: Parallel.CONFIG,
  },
  [WidgetType.SCATTER]: {
    component: Scatter.ScatterPlotComponent,
    config: Scatter.CONFIG,
  },
  [WidgetType.CALENDAR]: {
    component: Calendar.CalendarComponent,
    config: Calendar.CONFIG,
  },
};
