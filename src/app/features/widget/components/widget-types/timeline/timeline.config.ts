import { WidgetType } from "@features/widget/models/widget-type";

export const Timeline: WidgetType = {
  name: "timeline",
  type: "timeline",
  useAggregate: false,
  toggleKey: true,
  zoomControls: true,
  description:
    "Chart with channels on y-axis and time on x-axis. Values shown are raw measurements.",
  displayInfo: "channel values, station stoplight",
  minMetrics: 1,
  displayOptions: [
    {
      description: "each row is a channel - values are raw measurement values",
      dimensions: ["display"],
      displayType: "raw",
    },
    {
      description:
        "each row is a channel - values are average of measurements for each day",
      dimensions: ["display"],
      displayType: "day",
    },
    {
      description:
        "each row is a channel -  values are average of measurements for each hour",
      dimensions: ["display"],
      displayType: "hour",
    },
  ],
};
