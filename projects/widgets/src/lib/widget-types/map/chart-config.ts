import { WidgetTypeInfo } from "../../constants";
import { MapComponent } from "./map.component";

/** config for map component */
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
      "The map displays stations as icons on a map with colors indicating channel values. Values for channels are aggregated over the time range.",
    displayInfo: "station stoplight, station worst",
    defaultDisplay: "worst",
    displayOptions: {
      worst: {
        description:
          "Station icon color shows the value for the 'worst' (most out of range) channel",
        dimensions: ["display"],
      },
      stoplight: {
        description:
          "Station icon color indicates if all, some, or no channels are in/out of range",
        dimensions: ["display"],
      },
    },
  },
};
