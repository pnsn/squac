import { WidgetTypeInfo } from "app/widgets/constants";
import { MapComponent } from "./map.component";

export const CONFIG: WidgetTypeInfo = {
  component: MapComponent,
  config: {
    name: "map",
    type: "map",
    useAggregate: true,
    toggleKey: true,
    zoomControls: false,
    minMetrics: 1,
    description:
      "Map with icons representing stations. Value for a station is determined by the channel that is 'out of range' for the most metrics",
    displayInfo: "station stoplight, station worst",
    defaultDisplay: "worst",
    displayOptions: {
      worst: {
        description:
          "each map icon is a station - color reflects the aggregate value for the 'worst' channel",
        dimensions: ["display"],
      },
      stoplight: {
        description:
          "each map icon is a station - symbol color shows if all, some, or no channels are in/out of range",
        dimensions: ["display"],
      },
    },
  },
};
