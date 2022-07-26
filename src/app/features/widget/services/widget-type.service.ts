import { Injectable } from "@angular/core";
import { Metric } from "@core/models/metric";
import { PrecisionPipe } from "@shared/pipes/precision.pipe";
import * as colormap from "colormap";
//used to take widget data and transform to different formas
@Injectable()
export class WidgetTypeService {
  precisionPipe = new PrecisionPipe();

  // defaults for piecewise visualmap
  piecewiseDefaults = {
    type: "piecewise",
    itemGap: 5,
    textGap: 3,
    itemWidth: 10,
    itemHeight: 10,
    itemSymbol: "rect",
    bottom: "auto",
    top: 0,
    right: 54,
    left: 0,
    orient: "horizontal",
    textStyle: {
      fontSize: 10,
      width: 30,
      overflow: "truncate",
    },
  };

  // defaults for continuous visualmap
  continuousDefaults = {
    type: "continuous",
    itemWidth: 10,
    itemHeight: 100,
    hoverLink: false, //disable until formatting figured out
    itemSymbol: "rect",
    orient: "horizontal",
    bottom: "auto",
    top: 0,
    right: 54,
    left: "auto",
    calculable: true,
    formatter: (value) => this.precisionPipe.transform(value, 3),
    textStyle: {
      fontSize: 10,
    },
  };

  // defaults for echarts charts
  chartDefaults = {
    animation: false,
    legend: {
      show: false,
      top: 25,
      bottom: 40,
      right: 0,
      type: "scroll",
      orient: "vertical",
      align: "right",
      icon: "none",
      selector: true,
      selectorButtonGap: 5,
      selectorItemGap: 1,
      pageButtonItemGap: 1,
      pageIconSize: 10,
    },
    toolbox: {
      show: true,
      top: -5,
      feature: {
        dataZoom: {
          show: true, //not resetting correctlys
        },
      },
    },
    grid: {
      containLabel: true,
      top: 40,
      right: 8,
      bottom: 45,
      left: 35,
    },
    title: {
      top: 17,
      textStyle: {
        fontSize: 12,
        fontWeight: "normal",
        fontStyle: "normal",
        color: "#333",
      },
      left: "center",
    },
    useUtc: true,
    xAxis: {
      nameLocation: "center",
      name: "Measurement Start Date",
      nameGap: 23,
      nameTextStyle: {
        align: "center",
      },
      axisTick: {
        show: true,
      },
      axisLine: {
        show: true,
      },
    },
    yAxis: {
      nameLocation: "center",
    },
    tooltip: {
      confine: true,
      trigger: "item",
      axisPointer: {
        type: "cross",
      },
      // position: function (pt) {
      //   return [pt[0], "10%"];
      // },
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
        height: 15,
        showDetail: false,
        showDataShadow: false,
        bottom: 10,
        right: 20,
        xAxisIndex: [0, 1],
      },
      {
        type: "slider",
        realtime: true,
        orient: "vertical",
        left: "left",
        showDataShadow: false,
        moveHandleSize: 10,
        showDetail: false,
        width: 15,
      },
    ],
  };

  // add new options onto defaults
  // shallow copy
  chartOptions(options): any {
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

  //can use thresholds or another metric to color?
  getVisualMapFromThresholds(
    metrics: Metric[],
    thresholds,
    properties,
    dataRange,
    dimension
  ): any {
    const visualMaps = {};
    if (properties) {
      let numSplits = properties.numSplits;

      const outColor = properties.outOfRange
        ? properties.outOfRange.color[0]
        : "gray";
      let inColors;
      if (properties.inRange?.color) {
        inColors = properties.inRange.color;
      } else if (properties.inRange?.type) {
        inColors = colormap({
          colormap: properties.inRange.type,
          format: "hex",
        });
      }

      if (properties.reverseColors) {
        inColors.reverse();
      }

      metrics.forEach((metric) => {
        const metricId = metric.id;
        const threshold = thresholds.find(
          (threshold) => threshold.metricId === metricId
        );

        let min = null;
        let max = null;
        if (threshold) {
          min = threshold.min;
          max = threshold.max;
        }

        if (dataRange[metricId]) {
          if (min === null && max === null) {
            min = dataRange[metricId].min;
            max = dataRange[metricId].max;
          } else if (min === null || max === null) {
            numSplits = 1;
          }
          if (properties.displayType === "stoplight") {
            if (inColors.length < 3) {
              inColors = ["green", "yellow", "red"];
            }
            visualMaps[metricId] = {
              type: "stoplight",
              colors: {
                in: inColors[0],
                middle: inColors[Math.floor(inColors.length / 2)],
                out: inColors[inColors.length - 1],
              },
              min,
              max,
            };
          } else if (numSplits > 0) {
            const pieces = this.getPieces(
              min,
              max,
              numSplits,
              inColors,
              outColor
            );
            properties.outOfRange.opacity = 0;
            if (pieces.length > 0) {
              visualMaps[metricId] = {
                ...this.piecewiseDefaults,
                pieces: pieces.reverse(), // reverse for non-echarts legends
                dimension,
                min: min,
                max: max,
                outOfRange: properties.outOfRange,
              };
            }
          } else if (numSplits === 0) {
            properties.outOfRange.opacity = 1;
            min = min !== null ? min : dataRange[metricId]?.min;
            max = max !== null ? max : dataRange[metricId]?.max;

            const minText = this.precisionPipe.transform(min, 3);
            const maxText = this.precisionPipe.transform(max, 3);
            visualMaps[metricId] = {
              ...this.continuousDefaults,
              dimension,
              inRange: {
                color: inColors,
              },
              border: "light-gray",
              borderWidth: 1,
              min: min,
              max: max,
              outOfRange: properties.outOfRange,
            };
          } else {
            console.error("something went wrong");
          }
        } else {
          console.warn("no data");
        }
      });
    }
    return visualMaps;
  }

  private getPieces(min, max, numSplits, inColors, outColor): any[] {
    const pieces = [];
    // piece for -Infinity to min
    if (min !== null) {
      pieces.push({
        lt: min,
        color: outColor,
        label: `< ${this.precisionPipe.transform(min, 3)}`,
      });
      if (max === null) {
        pieces.push({
          gte: min,
          color: inColors[0],
          label: `≥ ${this.precisionPipe.transform(min, 3)}`,
        });
      }
    }

    if (max !== null && min !== null) {
      // In between pieces
      const diff = (max - min) / numSplits;
      const numColors = inColors.length - 1;
      let pieceMin = min;
      for (let n = 0; n < numSplits; n++) {
        //scale to color range
        const colorIndex =
          numSplits > 1 ? Math.floor((n / (numSplits - 1)) * numColors) : 0;
        const pieceMax = pieceMin + diff;
        let label = "";
        if (pieceMin !== null && pieceMax !== null) {
          label = `${this.precisionPipe.transform(
            pieceMin,
            3
          )} - ${this.precisionPipe.transform(pieceMax, 3)}`;
        }
        pieces.push({
          gte: pieceMin,
          lt: pieceMax,
          color: inColors[colorIndex],
          label,
        });
        pieceMin = pieceMax;
      }
    }

    // piece for max to Infinity
    if (max !== null) {
      if (min === null) {
        pieces.push({
          lte: max,
          color: inColors[0],
          label: `≤ ${this.precisionPipe.transform(max, 3)}`,
        });
      }
      pieces.push({
        gt: max,
        color: outColor,
        label: `> ${this.precisionPipe.transform(max, 3)}`,
      });
    }
    return pieces;
  }

  // return if value is inrange
  checkValue(value, visualMap): boolean {
    let hasMin;
    let hasMax;
    if (visualMap.range) {
      hasMin = value >= visualMap.range[0];
      hasMax = value <= visualMap.range[1];
    } else {
      hasMin = visualMap.min !== null ? value >= visualMap.min : true;
      hasMax = visualMap.max !== null ? value <= visualMap.max : true;
    }
    return hasMin && hasMax;
  }

  // find color corresponding to value
  getColorFromValue(value, visualMap, _dataMin?, _dataMax?): string {
    let color = "";
    if (value === null || value === undefined) {
      return "white";
    }
    if (!visualMap) {
      return "gray";
    }
    if (visualMap.type === "piecewise") {
      visualMap.pieces?.forEach((piece) => {
        const gtMin = piece.gt || piece.gt === 0 ? value > piece.gt : true;
        const gteMin = piece.gte || piece.gte === 0 ? value >= piece.gte : true;
        const ltMax = piece.lt || piece.lt === 0 ? value < piece.lt : true;
        const lteMax = piece.lte || piece.lte === 0 ? value <= piece.lte : true;
        color = gtMin && gteMin && ltMax && lteMax ? piece.color : color;
      });
    } else if (visualMap.type === "continuous") {
      const colors = visualMap.inRange.color;
      if (value <= visualMap.max && value >= visualMap.min) {
        const i = (value - visualMap.min) / (visualMap.max - visualMap.min);

        const colorIndex =
          colors.length > 1 ? Math.floor(Math.abs(i) * colors.length) : 0;
        color = colors[colorIndex];
      }
    } else if (visualMap.type === "stoplight") {
      const hasMin = visualMap.min !== null ? value >= visualMap.min : true;
      const hasMax = visualMap.max !== null ? value <= visualMap.max : true;
      color = hasMin && hasMax ? visualMap.colors.in : visualMap.colors.out;
    }

    if (!color) {
      color = visualMap.outOfRange.color[0];
    }

    return color;
  }

  //series for data with no time and multiple metrics
  // parallel and scatter
  getSeriesForMultipleMetrics(metrics, channels, data, series, dataRange): any {
    const stations = [];
    const axis = [];
    metrics.forEach((metric, i) => {
      if (series.type === "parallel") {
        let align;
        let axisAlign;
        let margin;
        if (i === 0) {
          align = "left";
          axisAlign = "left";
          margin = 8;
        } else if (i === metrics.length - 1) {
          align = "right";
          axisAlign = "right";
          margin = -6;
        } else {
          align = "center";
          axisAlign = "left";
          margin = 8;
        }

        axis.push({
          name: metric.name, //metric.name.replace(/_/g, " "),
          dim: i,
          min: dataRange[metric.id]?.min,
          max: dataRange[metric.id]?.max,
          scale: true,
          nameTextStyle: {
            align,
          },
          axisTick: {
            inside: true,
          },
          axisLabel: {
            align: axisAlign,
            inside: true,
            margin,
            formatter: (value) => this.precisionPipe.transform(value, 3),
          },
        });
      }
      series.dimensions.push(metric.name);
    });

    channels.forEach((channel) => {
      const station = {
        ...series,
        name: channel.nslc.toUpperCase(),
        data: [],
      };
      stations.push(station);

      const channelData = {
        name: channel.nslc.toUpperCase(),
        value: [],
      };

      metrics.forEach((metric) => {
        let val: number = null;
        if (data[channel.id] && data[channel.id][metric.id]) {
          const rowData = data[channel.id][metric.id];
          val = rowData[0].value;
        }
        channelData.value.push(val);
      });
      station.data.push(channelData);
    });
    return { series: stations, axis };
  }

  // channel & list of metric values
  // used for scatter, parallel etc
  multiMetricTooltipFormatting(params): string {
    let str = `${params.name}`;
    str += "<table><tr><th>Metric</th> <th>Value</th></tr>";

    params.value.forEach((data, i) => {
      str +=
        "<tr><td>" +
        params.dimensionNames[i] +
        "</td><td>" +
        (data !== null ? this.precisionPipe.transform(data) : "no data") +
        "</td></tr>";
    });
    str = str += "</br>";
    return str;
  }

  // tooltips for time x axis
  timeAxisFormatToolTip(params): string {
    let data = [];
    if (Array.isArray(params)) {
      data = [...params];
    } else {
      data.push(params);
    }

    let str = "";
    if (data[0]) {
      str += `<h4> ${data[0].seriesName} </h4>`;
    } else {
      str += this.timeAxisPointerLabelFormatting({ value: data[0].value[1] });
    }
    str +=
      "<table style='border-collapse: separate;border-spacing: 3px 0;'><tr><th colspan='2'>Channel</th> <th>Value</th></tr>";

    data.forEach((param) => {
      if (param.value) {
        const name = param.name ? param.name : param.seriesName;
        str +=
          "<tr><td>" +
          param.marker +
          "</td><td>" +
          name +
          "</td><td>" +
          this.precisionPipe.transform(param.value[2]) +
          "</td></tr>";
      }
    });

    return str;
  }

  // label formatting for time axis ticks
  timeAxisTickFormatting(val): string {
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

  // label formatting for time axis pointer label
  timeAxisPointerLabelFormatting(val): string {
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
    return Math.min(Math.max(minLen, maxLen) * 9, 50);
  }
}
