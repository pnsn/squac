import {
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from "echarts";

/** Helper functions for calendar chart */

/** default x axis config */
export const singleXAxisConfig: EChartsOption = {
  type: "category",
  axisLabel: {
    fontSize: 11,
    margin: 3,
    hideOverlap: true,
  },
  position: "bottom",
  axisTick: {
    show: true,
  },
  axisLine: {
    show: true,
  },

  nameLocation: "middle",
  axisPointer: {
    show: true,
  },
};

/** hour axis label for hour of week chart */
export const weekTimeXAxisConfig: EChartsOption = {
  ...singleXAxisConfig,
  axisLabel: {
    hideOverlap: true,
    margin: 3,
    fontSize: 11,
    formatter: (value: string): string => {
      const val = value.split(" ")[1];
      const time = val.split(":")[0];
      return time;
    },
  },
};

/** X axis config for week axis of hour of week chart */
export const weekXAxisConfig: EChartsOption = {
  ...singleXAxisConfig,
  nameGap: 13,
  offset: 13,
  axisLine: {
    show: false,
  },
  axisTick: {
    show: true,
    length: 11,
    inside: false,
    align: "label",
    interval: 0,
  },
  axisLabel: {
    show: true,
    margin: 0,
    hideOverlap: true,
    fontSize: 11,
    align: "center",
    interval: 0,
  },
  axisPointer: {
    show: false,
  },
  splitLine: {
    show: true,
    interval: (_index: number, value: string): boolean => {
      return value ? true : false;
    },
  },
};

/**
 * Format tooltip
 *
 * @param params item information
 * @returns tooltip string
 */
export function tooltipFormatter(
  params: TooltipComponentFormatterCallbackParams
): string {
  let str = "";
  if (!Array.isArray(params)) {
    if (params.value) {
      str += `<div class='tooltip-name'>${params.marker} ${params.value[3]} </div>`;
      str += `<table class='tooltip-table'><tbody><tr><td>${
        params.value[0]
      } (average): </td><td>${
        params.value[2]?.toPrecision(4) ?? "No Data"
      }</td></tr></tbody></table>`;
    }
  }
  return str;
}
