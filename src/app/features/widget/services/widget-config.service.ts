import { Injectable } from "@angular/core";

// TODO: this whole thing just needs a fixin'
@Injectable({
  providedIn: "root",
})
export class WidgetConfigService {
  get widgetTypes() {
    return [
      {
        id: 1,
        name: "table",
        type: "tabular",
        useAggregate: true,
        dimensions: null,
        description:
          "Table with stations as rows and metrics as columns. Values shown are aggregates of measurements over the time range.",
        dimensionInfo:
          "Selected metrics will be displayed as columns. Station rows will show the channel with the most values 'out of range'.",
        colorInfo: "Each metric can be colored separately.",
        colorTypes: ["binary"],
      },
      {
        id: 2,
        name: "timeline",
        type: "timeline",
        useAggregate: false,
        dimensions: ["display"],
        description:
          "Chart with channels on y-axis and time on x-axis. Values shown are raw measurements.",
        dimensionInfo:
          "The values for the 'display' metric will be plotted on the widget.",
        colorInfo:
          "Only the 'color' metric will be used by default, but others can be toggled on the widget. ",
        colorTypes: ["binary", "piecewise"],
      },
      {
        id: 3,
        name: "time series",
        type: "timeseries",
        useAggregate: false,
        dimensions: ["y-axis"],
        description:
          "Chart with measurement values on the y-axis and time on the x-axis. Each channel is a separate line.",
        dimensionInfo:
          "The values for the 'y-axis' metric will be plotted on the widget.",
        colorInfo:
          "Only the 'color' metric will be used by default, but others can be toggled on the widget. ",
        colorTypes: ["binary", "piecewise"],
      },
      {
        id: 4,
        name: "map",
        type: "map",
        useAggregate: true,
        description:
          "Map with icons representing stations. Value for a station is determined by the channel that is 'out of range' for the most metrics",
        dimensions: ["display"],
        dimensionInfo:
          "Station icons will show the value of the channel for the 'display' metric with the most values 'out of range'.",
        colorInfo:
          "Only the 'color' metric will be used by default, but others can be toggled on the widget. ",
        colorTypes: ["binary"],
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
        dimensions: null,
        description:
          "Chart with multiple metrics with separate y-axes, Each channel is a separate line. Values are aggregates of measurements over the time range.",
        dimensionInfo:
          "Each metric will be a separate axis. Channels are colored separately.",
        colorInfo: "This widget currently doesn't support custom colors.",
      },
      {
        id: 7,
        name: "scatter plot",
        type: "scatter-plot",
        useAggregate: true,
        dimensions: ["x-axis", "y-axis", "color"],
        description:
          "Chart with measurements on each axis. Channels are plotted as dots. Values are aggregates of the measurements over the time range.",
        dimensionInfo: "",
        colorTypes: ["binary", "piecewise"],
        colorInfo: "Values on the chart will be colored according to the ",
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

  get solidOptions() {
    return [
      {
        color: ["#336178"],
        label: "solid blue",
        type: "solid-blue",
      },
      {
        color: ["#ff950a"],
        label: "solid yellow",
        type: "solid-yellow",
      },
      {
        color: ["white"],
        label: "solid white",
        type: "solid-white",
      },
      {
        color: ["black"],
        label: "solid black",
        type: "solid-black",
      },
      {
        color: ["gray"],
        label: "solid gray",
        type: "solid-gray",
      },
    ];
  }

  get gradientOptions() {
    return [
      {
        label: "Rainbow",
        color: ["purple", "blue", "cyan", "green", "yellow", "orange", "red"],
        type: "rainbow",
      },
      {
        label: "Jet",
        color: ["blue", "cyan", "white", "yellow", "red"],
        type: "jet",
      },
      {
        label: "Polar",
        color: ["blue", "white", "red"],
        type: "polar",
      },
      {
        label: "Hot",
        color: ["black", "red", "orange", "yellow", "white"],
        type: "hot",
      },
      {
        label: "Red to Green",
        color: ["red", "white", "green"],
        type: "red-to-green",
      },
      {
        label: "Ocean",
        color: ["black", "blue", "cyan", "white"],
        type: "ocean",
      },
      {
        label: "Cool",
        color: ["cyan", "blue", "purple"],
        type: "cool",
      },
      {
        label: "Split",
        color: ["blue", "black", "red"],
        type: "split",
      },
      {
        label: "Gray",
        color: ["black", "gray", "white"],
        type: "gray",
      },
      {
        label: "Seis",
        color: ["red", "orange", "yellow", "green", "blue"],
        type: "seis",
      },
    ];
  }
}