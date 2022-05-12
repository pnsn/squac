import { Injectable } from "@angular/core";
import { Metric } from "@core/models/metric";

//used to take widget data and transform to different formas
@Injectable()
export class WidgetTypeService {
  constructor() {}

  getVisualMapFromThresholds(
    metrics: Metric[],
    thresholds,
    dataRange,
    dimension
  ) {
    const visualMaps = {};
    metrics.forEach((metric, i) => {
      let min = null;
      let max = null;
      if (thresholds[metric.id]) {
        //use threshold if set
        min = thresholds[metric.id].min;
        max = thresholds[metric.id].max;
      }
      // else if (metric.minVal && metric.maxVal) {
      //   //use metric default if exists
      //   min = metric.minVal;
      //   max = metric.maxVal;
      //   console.log(metric);
      //   console.log(min, max);
      // }
      if (dataRange[metric.id]) {
        //use data range
        min = min === null ? dataRange[metric.id].min : min;
        max = max === null ? dataRange[metric.id].max : max;
      }

      if (min !== null || max !== null) {
        visualMaps[metric.id] = {
          type: "piecewise", //TODO get type from threshold
          min,
          max,
          dimension,
          top: 0,
          right: 0,
          inRange: {
            //TODO get color from threshold
            color: ["white", "#AA069F"],
          },
          outOfRange: {
            color: "#999",
          },
        };
      }
    });

    return visualMaps;
  }

  getVisualMapFromMetrics() {}

  //series for data with no time and multiple metrics
  // parallel and scatter
  getSeriesForMultipleMetrics(metrics, channels, data, series) {
    const axis = [];
    metrics.forEach((metric, i) => {
      if (series.type === "parallel") {
        axis.push({
          name: metric.name, //metric.name.replace(/_/g, " "),
          dim: i,
        });
      }
      series.dimensions.push(metric.name);
    });
    series.dimensions.push("nslc");

    channels.forEach((channel) => {
      const channelData = [];
      metrics.forEach((metric, i) => {
        let val: number = null;
        if (data[channel.id] && data[channel.id][metric.id]) {
          const rowData = data[channel.id][metric.id];
          val = rowData[0].value;
        }
        channelData.push(val);
      });
      channelData.push(channel.nslc);
      series.data.push(channelData);
    });
    return { series, axis };
  }

  // channel & list of metric values
  // used for scatter, parallel etc
  multiMetricTooltipFormatting(params) {
    let str = params.value[params.value.length - 1];
    str += "<table><th>Metric</th> <th>Value</th>";
    params.data.forEach((data, i) => {
      if (i < params.data.length - 1) {
        str +=
          "<tr><td>" +
          params.dimensionNames[i] +
          "</td><td>" +
          data +
          "</td></tr>";
      }
    });
    str = str += "</br>";
    return str;
  }
  // series with time as x

  timeAxisFormatToolTip(params) {
    let data = [];
    if (Array.isArray(params)) {
      data = [...params];
    } else {
      data.push(params);
    }
    let str = "";

    if (data[0].axisValueLabel) {
      str += data[0].axisValueLabel;
    } else {
      str += this.timeAxisPointerLabelFormatting({ value: data[0].value[1] });
    }

    str += "<br />";
    data.forEach((param) => {
      const name = param.name ? param.name : param.seriesName;
      str += param.marker + " " + name + " " + param.value[3] + "<br />";
    });

    return str;
  }

  timeAxisTickFormatting(val) {
    const value = new Date(val);
    let formatOptions;
    if (value.getSeconds() !== 0) {
      formatOptions = { second: "2-digit" };
    } else if (value.getMinutes() !== 0) {
      formatOptions = { hour: "2-digit", minute: "2-digit" };
    } else if (value.getHours() !== 0) {
      formatOptions = { hour: "2-digit", minute: "2-digit" };
    } else if (value.getDate() !== 1) {
      formatOptions =
        value.getDay() === 0
          ? { month: "short", day: "2-digit" }
          : { month: "short", day: "2-digit" };
    } else if (value.getMonth() !== 0) {
      formatOptions = { month: "long" };
    } else {
      formatOptions = { year: "numeric" };
    }
    formatOptions.hour12 = false;
    formatOptions.timeZone = "UTC";
    const string = new Intl.DateTimeFormat("en-US", formatOptions).format(
      value
    );
    return string;
  }

  timeAxisPointerLabelFormatting(val) {
    const value = new Date(val.value);
    let formatOptions = {};
    formatOptions = {
      //have to reassign it this way or linter won't allow it set
      second: "2-digit",
      minute: "2-digit",
      hour: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: false,
      timeZone: "UTC",
    };
    if (value) {
      const string = new Intl.DateTimeFormat("en-US", formatOptions).format(
        value
      );
      return string;
    }
  }

  //calculate y axis position to prevent overlap
  yAxisLabelPosition(min, max): number {
    const minLen = (Math.round(min * 10) / 10).toString().length;
    const maxLen = (Math.round(max * 10) / 10).toString().length;
    return Math.max(minLen, maxLen) * 10 + 5;
  }
}
