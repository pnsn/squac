// add new options onto defaults

import { EChartsOption } from "echarts";

// shallow copy
export function copyChartOptions(
  defaultOptions: EChartsOption,
  options: EChartsOption
): EChartsOption {
  const newOptions = { ...defaultOptions };

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

  return newOptions as EChartsOption;
}
