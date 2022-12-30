import { WidgetTypeInfo } from "../../constants";
import { TabularComponent } from "./tabular.component";

/** Chart config for tabular component */
export const CONFIG: WidgetTypeInfo = {
  component: TabularComponent,
  config: {
    name: "table",
    type: "tabular",
    useAggregate: true,
    toggleKey: true,
    minMetrics: 1,
    zoomControls: false,
    description:
      "Table with stations or channels as rows and metrics as columns. Values shown are aggregates of measurements over the time range.",
    displayInfo: "channel values, station stoplight, worst channel",
    defaultDisplay: "channel",
    displayOptions: {
      channel: {
        description:
          "Value and symbol color show the aggregate value for each channel",
        dimensions: null,
      },
      stoplight: {
        description:
          "Symbol color shows if all, some, or no channels are in/out of range for each station",
        dimensions: null,
      },
      worst: {
        description:
          "Value and symbol color show the aggregate values for the 'worst' channel for each station",
        dimensions: null,
      },
    },
  },
};
