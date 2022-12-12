import { WidgetType } from "../enums";
import { WidgetConfig } from "../interfaces";
import {
  Calendar,
  Map,
  Parallel,
  Scatter,
  Tabular,
  Timechart,
  Timeline,
} from "../widget-types";

/**
 * Widget type info
 */
export type WidgetTypeInfo = {
  /** widget component */
  component: any;
  /** widget config */
  config: WidgetConfig;
};

/**
 * Associate widget types with the corresponding component
 */
export const WIDGET_TYPE_INFO: {
  [key in WidgetType]: WidgetTypeInfo;
} = {
  [WidgetType.TABULAR]: Tabular.CONFIG,
  [WidgetType.TIMELINE]: Timeline.CONFIG,
  [WidgetType.TIMESERIES]: Timechart.CONFIG,
  [WidgetType.MAP]: Map.CONFIG,
  [WidgetType.PARALLEL]: Parallel.CONFIG,
  [WidgetType.SCATTER]: Scatter.CONFIG,
  [WidgetType.CALENDAR]: Calendar.CONFIG,
};
