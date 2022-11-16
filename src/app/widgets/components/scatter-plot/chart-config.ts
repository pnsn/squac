import { WidgetTypeInfo } from "app/widgets/constants";
import { ScatterPlotComponent } from "./scatter-plot.component";

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
      "Chart with measurements on each axis. Channels are plotted as dots. Values are aggregates of the measurements over the time range.",
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
