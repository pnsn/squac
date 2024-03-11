import { WidgetConfig } from "../interfaces";
import { PARALLEL_CONFIG } from "../widget-types/parallel-plot";
import { CALENDAR_CONFIG } from "../widget-types/calendar";
import { MAP_CONFIG } from "../widget-types/map";
import { TABULAR_CONFIG } from "../widget-types/tabular";
import { TIMECHART_CONFIG } from "../widget-types/timechart";
import { SCATTER_CONFIG } from "../widget-types/scatter-plot";
import { TIMELINE_CONFIG } from "../widget-types/timeline";
import { InjectionToken } from "@angular/core";
import { BUD_CONFIG } from "../widget-types/bud";

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
  "bud-plot",
] as const;

export type WidgetType = typeof WidgetType[number];

export type WidgetTypes = Record<WidgetType, WidgetTypeInfo>;

/**
 * Injection token for configuring widget types
 */
export const WIDGET_TYPES = new InjectionToken<WidgetTypes>("");

/**
 * Associate widget types with the corresponding component
 */
export const DEFAULT_WIDGET_TYPES: Partial<WidgetTypes> = {
  ["tabular"]: TABULAR_CONFIG,
  ["timeline"]: TIMELINE_CONFIG,
  ["timeseries"]: TIMECHART_CONFIG,
  ["map"]: MAP_CONFIG,
  ["parallel-plot"]: PARALLEL_CONFIG,
  ["scatter-plot"]: SCATTER_CONFIG,
  ["calendar-plot"]: CALENDAR_CONFIG,
  ["bud-plot"]: BUD_CONFIG,
};
