import { WidgetType } from "@features/widget/models/widget-type";

export const Tabular: WidgetType = {
  name: "table",
  type: "tabular",
  useAggregate: true,
  toggleKey: true,
  minMetrics: 1,
  zoomControls: false,
  description:
    "Table with stations as rows and metrics as columns. Values shown are aggregates of measurements over the time range.",
  displayInfo: "channel values, station stoplight, worst channel",
  displayOptions: [
    {
      description:
        "each row is a channel - value and symbol color show the aggregate value",
      dimensions: null,
      displayType: "channel",
    },
    {
      description:
        "each row is a station - symbol color shows if all, some, or no channels are in/out of range",
      dimensions: null,
      displayType: "stoplight",
    },
    {
      description:
        "each row is a station - value and symbol color show the aggregate values for the 'worst' channel",
      dimensions: null,
      displayType: "worst",
    },
  ],
};
