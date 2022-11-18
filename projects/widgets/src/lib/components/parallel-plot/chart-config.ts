import { WidgetTypeInfo } from "../../constants";
import { ParallelPlotComponent } from "./parallel-plot.component";

export const CONFIG: WidgetTypeInfo = {
  component: ParallelPlotComponent,
  config: {
    name: "parallel",
    type: "parallel-plot",
    zoomControls: false,
    toggleKey: false,
    useAggregate: true,
    minMetrics: 2,
    displayInfo: "Color options not available for parallel plot.",
    description:
      "Chart with at least 2 metrics with separate y-axes, Each channel is a separate line. Values are aggregates of measurements over the time range.",
  },
};
