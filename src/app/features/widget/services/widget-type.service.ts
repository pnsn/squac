import { Injectable } from "@angular/core";
import { Metric } from "@core/models/metric";

//used to take widget data and transform to different formas
@Injectable()
export class WidgetTypeService {
  visualMapDefaults = {
    type: "piecewise", //TODO get type from threshold
    inRange: {
      //TODO get color from threshold
      color: ["white", "#AA069F"],
    },
    outOfRange: {
      color: "#999",
    },
    itemWidth: 14,
    itemHeight: 14,
    itemSymbol: "rect",
    orient: "vertical",
    textStyle: {
      fontSize: 10,
    },
    formatter: (value1, value2) => {
      return (
        Math.round(value1 * 10) / 10 + " - " + Math.round(value2 * 10) / 10
      );
    },
  };

  chartDefaults = {
    animation: false,
    legend: {
      show: false,
      type: "scroll",
      orient: "vertical",
      align: "left",
      left: "right",
    },
    // toolbox: {
    //   show: true,
    //   feature: {
    //     dataZoom: {
    //       show: true, //not resetting correctlys
    //     },
    //   },
    // },
    grid: {
      containLabel: true,
      left: 40,
      top: 20,
      right: 20,
    },
    useUtc: true,
    xAxis: {
      nameLocation: "center",
      name: "Measurement Start Date",
      nameGap: 30,
    },
    yAxis: {
      nameLocation: "center",
      nameTextStyle: {
        verticalAlign: "bottom",
        align: "middle",
      },
    },
    tooltip: {
      confine: true,
      trigger: "item",
      axisPointer: {
        type: "cross",
      },
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    dataZoom: [
      {
        type: "inside",
        moveOnMouseWheel: true,
        zoomOnMouseWheel: false,
        orient: "vertical",
      },
      {
        type: "slider",
        realtime: true,
        orient: "horizontal",
        moveHandleSize: 10,
        height: 20,
        showDetail: false,
        showDataShadow: false,
      },
      {
        type: "slider",
        realtime: true,
        orient: "vertical",
        left: "left",
        showDataShadow: false,
        moveHandleSize: 10,
        showDetail: false,
        width: 20,
      },
    ],
  };

  // add new options onto defaults
  // shallow copy
  chartOptions(options) {
    const newOptions = { ...this.chartDefaults };

    Object.keys(options).forEach((key) => {
      if (!(key in newOptions)) {
        newOptions[key] = {};
      }
      const keyOptions = options[key];
      if (Object.keys(keyOptions).length > 0) {
        Object.keys(keyOptions).forEach((childKey) => {
          newOptions[key][childKey] = keyOptions[childKey];
        });
      } else {
        newOptions[key] = options[key];
      }
    });

    return newOptions;
  }

  getVisualMapFromMetric(metric, dataRange, dimension) {
    return {
      ...this.visualMapDefaults,
      min: metric.minVal || dataRange[metric.id].min,
      max: metric.maxVal || dataRange[metric.id].max,
      dimension,
    };
  }

  //can use thresholds or another metric to color?
  getVisualMapFromThresholds(
    metrics: Metric[],
    thresholds,
    dataRange,
    dimension
  ) {
    const visualMaps = {};
    thresholds.forEach((threshold) => {
      let min = null;
      let max = null;
      min = threshold.min;
      max = threshold.max;

      threshold.metrics?.forEach((metricId) => {
        if (!min || min === 0) {
          min = dataRange[metricId].min;
        }
        if (!max || max === 0) {
          max = dataRange[metricId].max;
        }
        if (min !== null || max !== null) {
          visualMaps[metricId] = {
            ...this.visualMapDefaults,
            min,
            max,
            dimension,
            inRange: threshold.inRange,
            outOfRange: threshold.outOfRange,
            inverse: threshold.reverseColors || false,
            splitNumber: threshold.numSplits || 1,
          };
        }
      });
    });

    return visualMaps;
  }

  // getVisualMapFromMetrics() {}

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
      metrics.forEach((metric) => {
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
    return Math.max(minLen, maxLen) * 10;
  }
}
