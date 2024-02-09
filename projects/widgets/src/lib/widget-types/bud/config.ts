import { WidgetTypeInfo } from "../../constants";
import { BudComponent } from "./bud.component";

/** config for Bud component */
export const BUD_CONFIG: WidgetTypeInfo = {
  component: BudComponent,
  config: {
    name: "Bud (BETA)",
    type: "bud-plot",
    useAggregate: true,
    zoomControls: true,
    toggleKey: true,
    minMetrics: 1,
    description:
      "Chart with stations grouped by network. Used to display a single value for many stations in a dense format.",
    displayInfo: "Stations as squares",
    defaultDisplay: "default",
    displayOptions: {
      default: {
        description: "Station shows the average value of the channels",
        dimensions: ["display"],
      },
    },
  },
};
