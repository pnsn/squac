// add new options onto defaults

import { EChartsOption } from "echarts";

// shallow copy
export function copyChartOptions(
  defaultOptions: EChartsOption,
  options: EChartsOption
): EChartsOption {
  const newOptions = Object.assign({}, defaultOptions);

  Object.keys(options).forEach((key) => {
    if (!(key in newOptions)) {
      newOptions[key] = {};
    }
    const keyOptions = options[key];
    if (Object.keys(keyOptions).length > 0) {
      Object.keys(keyOptions).forEach((childKey: string) => {
        newOptions[key][childKey] = keyOptions[childKey];
      });
    } else {
      newOptions[key] = keyOptions;
    }
  });
  return newOptions as EChartsOption;
}
