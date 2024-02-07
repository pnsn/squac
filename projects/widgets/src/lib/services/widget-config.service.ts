import { Injectable } from "@angular/core";
import {
  Channel,
  Color,
  MeasurementPipe,
  MeasurementTypes,
  Metric,
  WidgetProperties,
  WidgetStatType,
} from "squacapi";
import { PrecisionPipe } from "../pipes/precision.pipe";
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
import {
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from "echarts";
import { ECHART_DEFAULTS } from "../components/e-chart/chart-config";

/**
 * Service to configure widgets
 * Consider refactoring
 */
@Injectable()
export class WidgetConfigService {
  readonly defaultPrecision = 4;
  thresholds: Threshold[];
  dataRange: DataRange;
  precisionPipe = new PrecisionPipe();
  measurementPipe = new MeasurementPipe();

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
  chartDefaults: EChartsOption = ECHART_DEFAULTS;

  //can use this.thresholds or another metric to color?
  /**
   * Creates visual maps for each metric using the widget properties
   *
   * @param metrics - metrics
   * @param properties - widget properties
   * @param dimension - series dimension
   * @returns - visual maps
   */
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
            min = min !== null ? min : this.dataRange[metricId].min;
            max = max !== null ? max : this.dataRange[metricId].max;

            //make just *slightly* outside min & max or default continuous won't show out of range
            const rangeMax = 1.000000001 * max;
            const rangeMin = 0.999999999 * min;
            const option: ContinousVisualMapOption = {
              ...this.continuousDefaults,
              dimension,
              inRange: {
                color: inColors,
              },
              min: rangeMin,
              max: rangeMax,
              range: [min, max],
              text: [metric.name, `unit: ${metric.unit}`],
              outOfRange: properties.outOfRange,
            };
            visualMaps[metricId] = option;
          }
        }
      });
    }
    return visualMaps;
  }

  /**
   * Creates visual map pieces
   *
   * @param min - min value for map
   * @param max - max value for map
   * @param numSplits - number of pieces
   * @param inColors - colors for in
   * @param outColor - colors for out
   * @returns array of pieces for visual map
   */
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

  /**
   * Checks if value is inside of range for visual map
   *
   * @param value number to check
   * @param visualMap visual map to check
   * @returns true if value is in range
   */
  checkValue(value: number, visualMap: VisualMapTypes): boolean {
    let hasMin: boolean;
    let hasMax: boolean;

    if (isContinuous(visualMap)) {
      const min = visualMap.range ? visualMap.range[0] : visualMap.min;
      const max = visualMap.range ? visualMap.range[1] : visualMap.max;
      hasMin = value >= min;
      hasMax = value <= max;
    } else {
      hasMin = visualMap.min !== null ? value >= visualMap.min : true;
      hasMax = visualMap.max !== null ? value <= visualMap.max : true;
    }
    return hasMin && hasMax;
  }

  /**
   * Find color that corresponds to the correct value
   *
   * @param value value to check
   * @param visualMap visual map to use
   * @param _dataMin min value of the data
   * @param _dataMax max value of the data
   * @returns color string
   */
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
  /**
   * Creates echarts series for parallel and scatter charts
   *
   * @param metrics metrics to use
   * @param channels channels to use
   * @param data data
   * @param series initial series data
   * @param stat widget statistic to calculate
   * @returns processed series config
   */
  getSeriesForMultipleMetrics(
    metrics: Metric[],
    channels: Channel[],
    data: MeasurementTypes[],
    series: any,
    stat: WidgetStatType
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

      // metrics.forEach((metric) => {
      //   if (!metric) return;
      //   let val: number = null;
      //   if (data.has(channel.id)) {
      //     const rowData = data.get(channel.id).get(metric.id);
      //     val = this.measurementPipe.transform(rowData, stat);
      //   }
      //   channelData.value.push(val);
      // });
      station.data.push(channelData);
    });
    return { series: stations, axis };
  }

  // channel & list of metric values
  // used for scatter, parallel etc
  /**
   * Formats tooltips for multiple metric charts
   *
   * @param params toolip component callback params
   * @returns html string for tooltip
   */
  multiMetricTooltipFormatting(
    params: TooltipComponentFormatterCallbackParams
  ): string {
    let str = "";
    if (!Array.isArray(params)) {
      str = `<div class='tooltip-name'> ${params.marker} ${params.name}</div>`;
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
    }

    return str;
  }

  /**
   * Tooltip formatter for chart with time x axis
   *
   * @param params tooltip formatter params
   * @returns html string for tooltip
   */
  timeAxisFormatToolTip(
    params: Partial<TooltipComponentFormatterCallbackParams>
  ): string {
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
        str += `
          <tr><td> ${
            param.marker
          } ${name} </td><td> ${param.value[2]?.toPrecision(4)}</td></tr>`;
      }
    });

    str += "</tbody></thead>";
    return str;
  }

  /**
   * Label formatting for x axis
   *
   * @param val unformatted string date
   * @returns formatted date string
   */
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

  /**
   * Hover pointer for time axis
   *
   * @param val - params for label
   * @returns formatted label string
   */
  timeAxisPointerLabelFormatting(val: LabelFormatterParams): string {
    const value = new Date(val.value);
    const formatOptions: Intl.DateTimeFormatOptions = {
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

  /**
   * Calculates the min, max, and count of data for the metric after including the given value
   *
   * @param metricId - id of metric
   * @param value - measurement value to add
   */
  calculateDataRange(metricId: number, value: number): void {
    const metricRange =
      metricId in this.dataRange ? this.dataRange[metricId] : { count: 0 };

    if (metricRange.min === undefined || value < metricRange.min) {
      metricRange.min = value;
    }
    if (metricRange.max === undefined || value > metricRange.max) {
      metricRange.max = value;
    }
    if (metricRange.count) metricRange.count++;
    this.dataRange[metricId] = metricRange;
  }
}
