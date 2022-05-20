import { Injectable } from "@angular/core";

// TODO: this whole thing just needs a fixin'
@Injectable({
  providedIn: "root",
})
export class WidgetConfigService {
  constructor() {}

  get widgetTypes() {
    return [
      {
        id: 1,
        name: "table",
        type: "tabular",
        useAggregate: true,
        expectedMetrics: null,
        description:
          "Table showing channels (grouped as stations) and aggregated measurement values.",
      },
      {
        id: 2,
        name: "timeline",
        type: "timeline",
        useAggregate: false,
        expectedMetrics: 1,
        description:
          "Measurements during time range for one metric, displayed as rows of channels",
      },
      {
        id: 3,
        name: "time series",
        type: "timeseries",
        useAggregate: false,
        expectedMetrics: 1,
        description:
          "Measurements during time range for one metric, displayed as lines of channels",
      },
      {
        id: 4,
        name: "map",
        type: "map",
        useAggregate: true,
        expectedMetrics: 1,
        description:
          "Map of channels (grouped as stations) represented by the measurement value or thresholds.",
      },
      // {
      //   id: 5,
      //   name: "box plot",
      //   type: "box-plot",
      //   use_aggregate: true,
      // },
      {
        id: 6,
        name: "parallel plot",
        type: "parallel-plot",
        useAggregate: true,
        expectedMetrics: null,
        description:
          "Aggregated measurements for multiple metrics, displayed as lines of channels on multiple axes.",
      },
      {
        id: 7,
        name: "scatter plot",
        type: "scatter-plot",
        useAggregate: true,
        expectedMetrics: 3,
        description: "Measurements for 3 metrics displayed as a scatter plot.",
      },
    ];
  }

  get statTypes() {
    return [
      {
        id: 13,
        type: "latest",
        name: "Most recent",
        description: "",
      },
      {
        id: 2,
        type: "med",
        name: "Median",
        description: "",
      },
      {
        id: 3,
        type: "min",
        name: "Minimum",
        description: "",
      },
      {
        id: 4,
        type: "max",
        name: "Maximum",
        description: "",
      },
      {
        id: 7,
        type: "p95",
        name: "95th percentile",
        description: "",
      },
      {
        id: 8,
        type: "p90",
        name: "90th percentile",
        description: "",
      },
      {
        id: 10,
        type: "p10",
        name: "10th percentile",
        description: "",
      },
      {
        id: 16,
        type: "p05",
        name: "5th percentile",
        description: "",
      },
      {
        id: 1,
        type: "mean",
        name: "Average",
        description: "",
      },
      {
        id: 5,
        type: "numSamps",
        name: "Sample Count",
        description: "",
      },
      {
        id: 17,
        type: "minabs",
        name: "Min of abs(min, max)",
        description: "",
      },
      {
        id: 18,
        type: "maxabs",
        name: "Max of abs(min, max)",
        description: "",
      },
    ];
  }

  get inRangeOptions() {
    return [
      {
        color: ["#336178"],
        label: "solid blue",
      },
      {
        color: ["#ff950a"],
        label: "solid yellow",
      },
      {
        color: ["white"],
        label: "solid white",
      },
      {
        color: ["black"],
        label: "solid black",
      },
      {
        color: ["gray"],
        label: "solid gray",
      },
      {
        label: "Rainbow",
        color: ["purple", "blue", "cyan", "green", "yellow", "orange", "red"],
      },
      {
        label: "Jet",
        color: ["blue", "cyan", "white", "yellow", "red"],
      },
      {
        label: "Polar",
        color: ["blue", "white", "red"],
      },
      {
        label: "Hot",
        color: ["black", "red", "orange", "yellow", "white"],
      },
      {
        label: "Red to Green",
        color: ["red", "white", "green"],
      },
      {
        label: "Ocean",
        color: ["black", "blue", "cyan", "white"],
      },
      {
        label: "Cool",
        color: ["cyan", "blue", "purple"],
      },
      {
        label: "Split",
        color: ["blue", "black", "red"],
      },
      {
        label: "Gray",
        color: ["black", "gray", "white"],
      },
      {
        label: "Seis",
        color: ["red", "orange", "yellow", "green", "blue"],
      },
    ];
  }
  get outOfRangeOptions() {
    return [
      {
        color: ["#336178"],
        label: "blue",
      },
      {
        color: ["#ff950a"],
        label: "yellow",
      },
      {
        color: ["white"],
        label: "white",
      },
      {
        color: ["black"],
        label: "black",
      },
      {
        color: ["gray"],
        label: "gray",
      },
    ];
  }
}
