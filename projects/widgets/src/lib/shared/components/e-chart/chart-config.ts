import { EChartsOption } from "echarts";

/** base echarts component configuration */
export const BASE_CHART_CONFIG: EChartsOption = {
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
  useUTC: true,
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
      showDataShadow: undefined,
      bottom: 10,
      right: 20,
      xAxisIndex: [0, 1],
    },
    {
      type: "slider",
      realtime: true,
      orient: "vertical",
      left: "left",
      showDataShadow: undefined,
      moveHandleSize: 10,
      showDetail: false,
      width: 15,
    },
  ],
};
