import { WidgetConfig } from "../interfaces";
import { CALENDAR_CONFIG } from "../widget-types/calendar/config";
import { PARALLEL_CONFIG } from "../widget-types/parallel-plot/config";
import { MAP_CONFIG } from "../widget-types/map/config";
import { TABULAR_CONFIG } from "../widget-types/tabular/config";
import { TIMECHART_CONFIG } from "../widget-types/timechart/config";
import { SCATTER_CONFIG } from "../widget-types/scatter-plot/config";
import { TIMELINE_CONFIG } from "../widget-types/timeline/config";
import { InjectionToken } from "@angular/core";

/**
 * Widget type info
 */
export type WidgetTypeInfo = {
  /** widget component */
  component: any;
  /** widget config */
  config: WidgetConfig;
};

export const WidgetType = [
  "tabular",
  "timeline",
  "timeseries",
  "map",
  "parallel-plot",
  "scatter-plot",
  "calendar-plot",
] as const;

export type WidgetType = typeof WidgetType[number];

export type WidgetTypes = Record<WidgetType, WidgetTypeInfo>;

/**
 * Associate widget types with the corresponding component
 */
export const DEFAULT_WIDGET_TYPES: WidgetTypes = {
  ["tabular"]: TABULAR_CONFIG,
  ["timeline"]: TIMELINE_CONFIG,
  ["timeseries"]: TIMECHART_CONFIG,
  ["map"]: MAP_CONFIG,
  ["parallel-plot"]: PARALLEL_CONFIG,
  ["scatter-plot"]: SCATTER_CONFIG,
  ["calendar-plot"]: CALENDAR_CONFIG,
};

/**
 * Injection token for configuring widget types
 */
export const WIDGET_TYPES = new InjectionToken<WidgetTypes>("");
