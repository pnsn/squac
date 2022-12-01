import { WidgetTypeInfo } from "../../constants";
import { TimelineComponent } from "./timeline.component";

export const CONFIG: WidgetTypeInfo = {
  component: TimelineComponent,
  config: {
    name: "timeline",
    type: "timeline",
    useAggregate: false,
    toggleKey: true,
    zoomControls: true,
    description: "Chart with channels on y-axis and time on x-axis.",
    displayInfo: "channel values, station stoplight",
    minMetrics: 1,
    defaultDisplay: "raw",
    displayOptions: {
      raw: {
        description: "Values are raw measurement values over time range",
        dimensions: ["display"],
      },
      day: {
        description:
          "Values are the average of measurement values for each day in time range",
        dimensions: ["display"],
      },
      hour: {
        description:
          "Values are the average of measurement values for each hour in the time range",
        dimensions: ["display"],
      },
    },
  },
};
