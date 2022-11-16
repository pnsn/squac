import { WidgetConfig } from "../../interfaces";

export const CONFIG: WidgetConfig = {
  name: "time series",
  type: "timeseries",
  useAggregate: false,
  toggleKey: true,
  zoomControls: true,
  minMetrics: 1,
  description:
    "Chart with measurement values on the y-axis and time on the x-axis. Each channel is a separate line.",
  displayInfo: "channel values",
  defaultDisplay: "channel",
  displayOptions: {
    channel: {
      description:
        "each line is a channel - lines are plot raw measurement values",
      dimensions: ["y-axis"],
    },
  },
};
