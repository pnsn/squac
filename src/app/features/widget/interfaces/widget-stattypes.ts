/**
 * Stat types available in squac
 */
export enum WidgetStatTypes {
  MEAN = "mean",
  LATEST = "latest",
  NUM_SAMPS = "numSamps",
  MEDIAN = "median",
  MIN = "min",
  MAX = "max",
  MIN_ABS = "minabs",
  MAX_ABS = "maxabs",
  P95 = "p95",
  P90 = "p90",
  p10 = "p10",
  p05 = "p05",
}

export const WidgetStatTypeNames: { [key in WidgetStatTypes]: string } = {
  [WidgetStatTypes.MEAN]: "Average",
  [WidgetStatTypes.LATEST]: "Most Recent",
  [WidgetStatTypes.NUM_SAMPS]: "Sample Count",
  [WidgetStatTypes.MEDIAN]: "Median",
  [WidgetStatTypes.MIN]: "Minimum",
  [WidgetStatTypes.MAX]: "Maximum",
  [WidgetStatTypes.MIN_ABS]: "Min of abs(min, max)",
  [WidgetStatTypes.MAX_ABS]: "Max of abs(min, max)",
  [WidgetStatTypes.P95]: "95th percentile",
  [WidgetStatTypes.P90]: "90th percentile",
  [WidgetStatTypes.p10]: "10th percentile",
  [WidgetStatTypes.p05]: "5th percentile",
};
