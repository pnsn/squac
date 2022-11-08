import { WidgetType } from "@features/widget/models/widget-type";

export const Calendar: WidgetType = {
  name: "calendar",
  type: "calendar-plot",
  useAggregate: false,
  zoomControls: true,
  toggleKey: true,
  minMetrics: 1,
  description:
    "Chart with average measurement values on the y-axis and the selected display type on the x-axis. Each channel is a separate line.",
  displayInfo: "channels as dots",
  displayOptions: [
    {
      description: "days of week",
      displayType: "days-week",
      dimensions: ["display"],
    },
    {
      description: "hour of week",
      displayType: "hours-week",
      dimensions: ["display"],
    },
    {
      description: "hours of day",
      displayType: "hours-day",
      dimensions: ["display"],
    },
  ],
};
