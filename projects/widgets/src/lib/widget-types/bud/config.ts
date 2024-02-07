import { WidgetTypeInfo } from "../../constants";
import { BudComponent } from "./bud.component";

/** config for Bud component */
export const BUD_CONFIG: WidgetTypeInfo = {
  component: BudComponent,
  config: {
    name: "Bud",
    type: "bud-plot",
    useAggregate: true,
    zoomControls: true,
    toggleKey: true,
    minMetrics: 1,
    description: "The Bud chart.",
    displayInfo: "channels as dots",
    defaultDisplay: "days-week",
    displayOptions: {
      "days-week": {
        description: "calculate average for each day of the week",
        dimensions: ["display"],
      },
    },
  },
};
