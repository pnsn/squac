import { EChartsOption } from "echarts";

// defaults for echarts charts
export const ECHART_DEFAULTS: EChartsOption = {
  textStyle: {
    fontSize: 11,
  },
  animation: false,
  legend: {
    show: false,
  },
  grid: {
    containLabel: true,
    top: 5,
    right: 8,
    bottom: 38,
    left: 35,
  },
  useUtc: true,
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
  },
  dataZoom: [
    {
      type: "inside",
      moveOnMouseWheel: true,
      zoomOnMouseWheel: false,
      orient: "vertical",
      filterMode: "none",
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
      filterMode: "none",
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
      filterMode: "none",
    },
  ],
};

export const ECHART_DENSE_DEFAULTS: EChartsOption = {
  grid: {
    containLabel: true,
    top: 5,
    right: 8,
    bottom: 15,
    left: 10,
  },
  dataZoom: [],
};
