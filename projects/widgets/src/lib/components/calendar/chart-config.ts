import { WidgetTypeInfo } from "../../constants";
import { CalendarComponent } from "./calendar.component";

export const CONFIG: WidgetTypeInfo = {
  component: CalendarComponent,
  config: {
    name: "calendar",
    type: "calendar-plot",
    useAggregate: false,
    zoomControls: true,
    toggleKey: true,
    minMetrics: 1,
    description:
      "The calendar chart displays the average measurement values for each channel over the selected time periods.",
    displayInfo: "channels as dots",
    defaultDisplay: "days-week",
    displayOptions: {
      "days-week": {
        description: "calculate average for each day of the week",
        dimensions: ["display"],
      },
      "hours-week": {
        description: "calculate average for each hour of the week",
        dimensions: ["display"],
      },
      "hours-day": {
        description: "calculate average for each hour of the day",
        dimensions: ["display"],
      },
    },
  },
};