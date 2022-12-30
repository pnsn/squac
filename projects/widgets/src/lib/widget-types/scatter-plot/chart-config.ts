import { WidgetTypeInfo } from "../../constants";
import { ScatterPlotComponent } from "./scatter-plot.component";

/** Scatter plot config */
export const CONFIG: WidgetTypeInfo = {
  component: ScatterPlotComponent,
  config: {
    name: "scatter",
    type: "scatter-plot",
    toggleKey: true,
    zoomControls: true,
    useAggregate: true,
    minMetrics: 3,
    description:
      "Chart comparing 3 metrics measurements on x-axis, y-axis, and color. Values are aggregates of the measurements over the time range.",
    displayInfo: "channels as dots",
    defaultDisplay: "channel",
    displayOptions: {
      channel: {
        description:
          "each dot represents a channel - colors show aggregate value for a 3rd metric",
        dimensions: ["x-axis", "y-axis", "color"],
      },
    },
  },
};
