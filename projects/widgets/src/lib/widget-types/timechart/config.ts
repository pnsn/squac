import { WidgetTypeInfo } from "../../constants";
import { TimechartComponent } from "./timechart.component";

/**
 * Configuration for timechart widget
 */
export const TIMECHART_CONFIG: WidgetTypeInfo = {
  component: TimechartComponent,
  config: {
    name: "time series",
    type: "timeseries",
    useAggregate: false,
    toggleKey: true,
    zoomControls: true,
    minMetrics: 1,
    description:
      "Chart with raw measurement values on the y-axis and time on the x-axis.",
    displayInfo: "channel values",
    defaultDisplay: "channel",
    displayOptions: {
      channel: {
        description: "each line is a channel - values raw measurement values",
        dimensions: ["y-axis"],
      },
    },
  },
};
