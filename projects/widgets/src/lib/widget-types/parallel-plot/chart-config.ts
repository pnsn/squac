import { WidgetTypeInfo } from "../../constants";
import { ParallelPlotComponent } from "./parallel-plot.component";

/** Parallel plot config */
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
      "Chart that compares aggregated values for channels for multiple metrics on separate y-axes. Each channel is a separate line. Values are aggregates of measurements over the time range. Custom colors are currently not available.",
  },
};
