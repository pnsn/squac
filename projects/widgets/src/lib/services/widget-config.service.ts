import { Injectable } from "@angular/core";
import { Channel, Color, Metric, WidgetProperties } from "squacapi";
import { PrecisionPipe } from "../shared/pipes/precision.pipe";
import colormap from "colormap";
import { Threshold } from "squacapi";
import {
  VisualMap,
  StoplightVisualMapOption,
  VisualPiece,
  DataRange,
  LabelFormatterParams,
  ParallelAxisOption,
  ProcessedData,
  VisualMapTypes,
  PiecewiseVisualMapOption,
  ContinousVisualMapOption,
  isContinuous,
} from "../interfaces";
import { DefaultLabelFormatterCallbackParams, EChartsOption } from "echarts";

//used to take widget data and transform to different formas
@Injectable()
export class WidgetConfigService {
  thresholds: Threshold[];
  dataRange: DataRange;
  precisionPipe = new PrecisionPipe();

  // defaults for piecewise visualmap
  piecewiseDefaults: PiecewiseVisualMapOption = {
    type: "piecewise",
    backgroundColor: "rgba(255,255,255,0.8)",
    align: "right",
    itemGap: 5,
    textGap: 3,
    itemWidth: 10,
    itemHeight: 10,
    showLabel: true,
    itemSymbol: "rect",
    textStyle: {
      fontSize: 11,
      overflow: "truncate",
    },
    top: 5,

    right: 5,
    orient: "vertical",
  };

  // defaults for continuous visualmap
  continuousDefaults: ContinousVisualMapOption = {
    type: "continuous",
    backgroundColor: "rgba(255,255,255,0.8)",
    align: "auto",
    itemWidth: 10,
    itemHeight: 75,
    hoverLink: false, //disable until formatting figured out
    calculable: true,
    formatter: (value: number) => this.precisionPipe.transform(value, 3),
    textStyle: {
      fontSize: 11,
    },
    top: 5,
    right: 5,
    orient: "vertical",
  };

  // defaults for echarts charts
  chartDefaults: EChartsOption = {
    textStyle: {
      fontSize: 11,
    },
    animation: false,
    legend: {
      show: false,
    },
    visualMap: {
      show: true,
    },
    grid: {
      containLabel: true,
      top: 5,
      right: 8,
      bottom: 38,
      left: 35,
    },
    useUtc: true,
    xAxis: {
      nameLocation: "middle",
      name: "Measurement Start Date",
      nameGap: 14,
      nameTextStyle: {
        align: "center",
      },
      axisTick: {
        show: true,
      },
      axisLine: {
        show: true,
      },
      axisLabel: {
        margin: 3,
        fontSize: 11,
      },
    },
    yAxis: {
      nameLocation: "middle",
      axisLabel: {
        fontSize: 11,
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          icon: null,
        },
      },
    },
    tooltip: {
      padding: 4,
      confine: true,
      trigger: "item",
      axisPointer: {
        type: "cross",
      },
      textStyle: {
        fontSize: 11,
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
        filterMode: "filter",
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
  chartOptions(options): EChartsOption {
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

  //can use this.thresholds or another metric to color?
  getVisualMapFromThresholds(
    metrics: Metric[],
    properties: WidgetProperties,
    dimension: number
  ): VisualMap {
    const visualMaps: VisualMap = {};
    if (properties && this.thresholds && this.dataRange) {
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
        if (!metric) {
          return;
        }
        const metricId = metric.id;
        const threshold = this.thresholds.find(
          (threshold) => threshold.metricId === metricId
        );

        let min = null;
        let max = null;
        if (threshold) {
          min = threshold.min;
          max = threshold.max;
        }

        if (this.dataRange[metricId]) {
          if (min === null && max === null) {
            min = this.dataRange[metricId].min;
            max = this.dataRange[metricId].max;
          } else if (min === null || max === null) {
            numSplits = 1;
          }
          if (properties.displayType === "stoplight") {
            if (inColors.length < 3) {
              inColors = ["green", "yellow", "red"];
            }
            const option: StoplightVisualMapOption = {
              type: "stoplight",
              colors: {
                in: inColors[0],
                middle: inColors[Math.floor(inColors.length / 2)],
                out: inColors[inColors.length - 1],
              },
              min,
              max,
            };
            visualMaps[metricId] = option;
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
              const option: PiecewiseVisualMapOption = {
                ...this.piecewiseDefaults,
                pieces: pieces.reverse(), // reverse for non-echarts legends
                dimension,
                text: [metric.name, `unit: ${metric.unit}`],
                min: min,
                max: max,
                outOfRange: properties.outOfRange,
              };
              visualMaps[metricId] = option;
            }
          } else if (numSplits === 0) {
            properties.outOfRange.opacity = 1;
            min = min !== null ? min : this.dataRange[metricId]?.min;
            max = max !== null ? max : this.dataRange[metricId]?.max;
            const option: ContinousVisualMapOption = {
              ...this.continuousDefaults,
              dimension,
              inRange: {
                color: inColors,
              },
              min,
              max,
              range: [min, max],
              text: [metric.name, `unit: ${metric.unit}`],
              outOfRange: properties.outOfRange,
            };
            visualMaps[metricId] = option;
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

  private getPieces(
    min: number,
    max: number,
    numSplits: number,
    inColors: Color[],
    outColor: string
  ): VisualPiece[] {
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
  checkValue(value: number, visualMap: VisualMapTypes): boolean {
    let hasMin: boolean;
    let hasMax: boolean;

    if (isContinuous(visualMap)) {
      hasMin = value >= visualMap.range[0];
      hasMax = value <= visualMap.range[1];
    } else {
      hasMin = visualMap.min !== null ? value >= visualMap.min : true;
      hasMax = visualMap.max !== null ? value <= visualMap.max : true;
    }
    return hasMin && hasMax;
  }

  // find color corresponding to value
  getColorFromValue(
    value: number,
    visualMap: VisualMapTypes,
    _dataMin?: number,
    _dataMax?: number
  ): string {
    let color = "";
    if (value === null || value === undefined) {
      return "white";
    }
    if (!visualMap) {
      return "gray";
    }
    switch (visualMap.type) {
      case "piecewise":
        visualMap.pieces?.forEach((piece) => {
          const gtMin = piece.gt || piece.gt === 0 ? value > piece.gt : true;
          const gteMin =
            piece.gte || piece.gte === 0 ? value >= piece.gte : true;
          const ltMax = piece.lt || piece.lt === 0 ? value < piece.lt : true;
          const lteMax =
            piece.lte || piece.lte === 0 ? value <= piece.lte : true;
          color = gtMin && gteMin && ltMax && lteMax ? piece.color : color;
        });
        break;

      case "continuous": {
        const colors = visualMap.inRange.color;
        if (value <= visualMap.max && value >= visualMap.min) {
          const i = (value - visualMap.min) / (visualMap.max - visualMap.min);

          const colorIndex =
            colors.length > 1 ? Math.floor(Math.abs(i) * colors.length) : 0;
          color = colors[colorIndex];
        }
        break;
      }

      case "stoplight": {
        const hasMin = visualMap.min !== null ? value >= visualMap.min : true;
        const hasMax = visualMap.max !== null ? value <= visualMap.max : true;
        color = hasMin && hasMax ? visualMap.colors.in : visualMap.colors.out;
        break;
      }
    }

    if (!color && "outOfRange" in visualMap) {
      color = visualMap.outOfRange.color[0];
    }

    return color;
  }

  //series for data with no time and multiple metrics
  // parallel and scatter
  getSeriesForMultipleMetrics(
    metrics: Metric[],
    channels: Channel[],
    data: ProcessedData,
    series: any
  ): { series: any; axis?: ParallelAxisOption[] } {
    const stations = [];
    const axis: ParallelAxisOption[] = [];
    metrics.forEach((metric: Metric, i) => {
      if (!metric) return;
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
          min: this.dataRange[metric.id]?.min,
          max: this.dataRange[metric.id]?.max,
          scale: true,
          nameTextStyle: {
            align,
          },
          axisTick: {
            inside: true,
          },
          nameGap: 6,
          axisLabel: {
            fontSize: 11,
            align: axisAlign,
            inside: true,
            margin,
            formatter: (value) => this.precisionPipe.transform(value, 3),
          },
        });
      }
      series.dimensions.push(metric.name);
    });

    channels.forEach((channel: Channel) => {
      const station = {
        ...series,
        name: channel.nslc,
        data: [],
      };
      stations.push(station);

      const channelData = {
        name: channel.nslc,
        value: [],
      };

      metrics.forEach((metric) => {
        if (!metric) return;
        let val: number = null;
        if (data.has(channel.id)) {
          const rowData = data.get(channel.id).get(metric.id);
          val = rowData && rowData[0] ? rowData[0].value : val;
        }
        channelData.value.push(val);
      });
      station.data.push(channelData);
    });
    return { series: stations, axis };
  }

  // channel & list of metric values
  // used for scatter, parallel etc
  multiMetricTooltipFormatting(
    params: DefaultLabelFormatterCallbackParams
  ): string {
    let str = `<div class='tooltip-name'> ${params.marker} ${params.name}</div>`;
    str +=
      "<table class='tooltip-table'><thead><th>Metric</th> <th>Value</th></thead><tbody>";

    if (Array.isArray(params.value)) {
      params.value.forEach((data: number, i) => {
        str +=
          "<tr><td>" +
          params.dimensionNames[i] +
          "</td><td>" +
          (data !== null ? this.precisionPipe.transform(data) : "no data") +
          "</td></tr>";
      });
    }

    str = str += "</tbody></table>";
    return str;
  }

  // tooltips for time x axis
  timeAxisFormatToolTip(params: DefaultLabelFormatterCallbackParams): string {
    let data = [];
    if (Array.isArray(params)) {
      data = [...params];
    } else {
      data.push(params);
    }

    let str =
      "<table class='tooltip-table'><thead><th>Channel</th> <th>Value</th></thead> <tbody>";

    data.forEach((param) => {
      if (param.value) {
        const name = param.name ? param.name : param.seriesName;
        str +=
          "<tr><td>" +
          param.marker +
          name +
          "</td><td>" +
          this.precisionPipe.transform(param.value[2]) +
          "</td></tr>";
      }
    });

    str += "</tbody></thead>";
    return str;
  }

  // label formatting for time axis ticks
  timeAxisTickFormatting(val: string): string {
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
    let string;
    try {
      string = new Intl.DateTimeFormat("en-US", formatOptions).format(value);
    } catch {
      string = val;
    }

    return string;
  }

  // label formatting for time axis pointer label
  timeAxisPointerLabelFormatting(val: LabelFormatterParams): string {
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
    return "";
  }

  //calculate y axis position to prevent overlap
  yAxisLabelPosition(min: number, max: number): number {
    const minLen = (Math.round(min * 10) / 10).toString().length;
    const maxLen = (Math.round(max * 10) / 10).toString().length;
    return Math.min(Math.max(minLen, maxLen) * 9, 50);
  }
}
