import { WidgetConfig } from "../../interfaces/widget-config.interface";

export const Calendar: WidgetConfig = {
  name: "calendar",
  type: "calendar-plot",
  useAggregate: false,
  zoomControls: true,
  toggleKey: true,
  minMetrics: 1,
  description:
    "Chart with average measurement values on the y-axis and the selected display type on the x-axis. Each channel is a separate line.",
  displayInfo: "channels as dots",
  defaultDisplay: "days-week",
  displayOptions: {
    "days-week": {
      description: "days of week",
      dimensions: ["display"],
    },
    "hours-week": {
      description: "hour of week",
      dimensions: ["display"],
    },
    "hours-day": {
      description: "hours of day",
      dimensions: ["display"],
    },
  },
};
