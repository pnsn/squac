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
        showChannelList: false,
        description:
          "Table with stations as rows and metrics as columns. Values shown are aggregates of measurements over the time range.",
        displayInfo: "channel values, station stoplight, worst channel",
        displayOptions: [
          {
            description:
              "each row is a station, station shows values for channel with most metrics out of range",
            dimensions: null,
            displayType: "worst",
          },
          {
            description:
              "each row is a station, station shows number of channels in/out of range",
            dimensions: null,
            displayType: "stoplight",
          },
          {
            description:
              "each row is a channel, channels show aggregate values",
            dimensions: null,
            displayType: "channel",
          },
        ],
      },
      {
        id: 2,
        name: "timeline",
        type: "timeline",
        useAggregate: false,
        showChannelList: false,
        description:
          "Chart with channels on y-axis and time on x-axis. Values shown are raw measurements.",
        displayInfo: "channel values, station stoplight",
        displayOptions: [
          // {
          //   description:
          //     "each row is a station, station shows number of channels in/out of range",
          //   grouping: "station",
          //   dimensions: ["display"],
          //   displayType: "stoplight",
          // },
          {
            description:
              "each row is a channel, channels show measurement values",
            dimensions: ["display"],
            displayType: "channel",
          },
        ],
      },
      {
        id: 3,
        name: "time series",
        type: "timeseries",
        useAggregate: false,
        showChannelList: true,
        description:
          "Chart with measurement values on the y-axis and time on the x-axis. Each channel is a separate line.",
        displayInfo: "channel values",
        displayOptions: [
          {
            description:
              "each line is a channel, channels show measurement values",
            dimensions: ["y-axis"],
            displayType: "channel",
          },
        ],
      },
      {
        id: 4,
        name: "map",
        type: "map",
        useAggregate: true,
        showChannelList: true,
        description:
          "Map with icons representing stations. Value for a station is determined by the channel that is 'out of range' for the most metrics",
        displayInfo: "station stoplight, station worst",
        displayOptions: [
          {
            description:
              "each map icon is a station, stations show measurement values",
            dimensions: ["display"],
            displayType: "worst",
          },
          {
            description:
              "each map icon is a station, station shows number of channels in/out of range",
            dimensions: ["display"],
            displayType: "stoplight",
          },
        ],
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
        showChannelList: true,
        displayInfo: "no color options, channels are lines",
        description:
          "Chart with multiple metrics with separate y-axes, Each channel is a separate line. Values are aggregates of measurements over the time range.",
        displayOptions: [],
      },
      {
        id: 7,
        name: "scatter plot",
        type: "scatter-plot",
        showChannelList: true,
        useAggregate: true,
        description:
          "Chart with measurements on each axis. Channels are plotted as dots. Values are aggregates of the measurements over the time range.",
        displayInfo: "channels as dots",
        displayOptions: [
          {
            description: "each dot represents a channel",
            dimensions: ["x-axis", "y-axis", "color"],
            displayType: "channel",
          },
        ],
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
        type: "median",
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
        color: ["red"],
        label: "solid red",
        type: "solid-red",
      },
      {
        color: ["green"],
        label: "solid green",
        type: "solid-green",
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
        label: "Red to Green",
        type: "redgreen",
        color: ["green", "yellow", "red"],
      },
      {
        label: "Rainbow",
        type: "rainbow",
      },
      {
        label: "Jet",
        type: "jet",
      },
      {
        label: "Hot",
        type: "hot",
      },
      {
        label: "Blue to Red",
        type: "bluered",
      },
      {
        label: "Viridis",
        type: "viridis",
      },
      {
        label: "Cool",
        type: "cool",
      },
      {
        label: "Greys",
        type: "greys",
      },
    ];
  }
}
