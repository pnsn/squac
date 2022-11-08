import { Component } from "@angular/core";
import { CalendarComponent } from "../components/widget-types/calendar/calendar.component";
import { Calendar } from "../components/widget-types/calendar/calendar.config";
import { GenericWidgetComponent } from "../components/widget-types/interfaces/generic-widget.component";
import { WidgetTypeComponent } from "../components/widget-types/interfaces/widget-type.interface";
import { MapComponent } from "../components/widget-types/map/map.component";
import { Map } from "../components/widget-types/map/map.config";
import { ParallelPlotComponent } from "../components/widget-types/parallel-plot/parallel-plot.component";
import { Parallel } from "../components/widget-types/parallel-plot/parallel-plot.config";
import { ScatterPlot } from "../components/widget-types/scatter-plot/scatter-plot-config";
import { ScatterPlotComponent } from "../components/widget-types/scatter-plot/scatter-plot.component";
import { TabularComponent } from "../components/widget-types/tabular/tabular.component";
import { Tabular } from "../components/widget-types/tabular/tabular.config";
import { TimechartComponent } from "../components/widget-types/timechart/timechart.component";
import { TimeChart } from "../components/widget-types/timechart/timechart.config";
import { TimelineComponent } from "../components/widget-types/timeline/timeline.component";
import { Timeline } from "../components/widget-types/timeline/timeline.config";
import { WidgetType } from "./widget-type";

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
  config: WidgetType;
};
/**
 * Associate widget types with the corresponding component
 */
export const WidgetTypeInfo: {
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
