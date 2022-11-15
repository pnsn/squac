/**
 * Stat types available in squac
 */
export enum WidgetStatType {
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

export const WidgetStatTypeNames: { [key in WidgetStatType]: string } = {
  [WidgetStatType.MEAN]: "Average",
  [WidgetStatType.LATEST]: "Most Recent",
  [WidgetStatType.NUM_SAMPS]: "Sample Count",
  [WidgetStatType.MEDIAN]: "Median",
  [WidgetStatType.MIN]: "Minimum",
  [WidgetStatType.MAX]: "Maximum",
  [WidgetStatType.MIN_ABS]: "Min of abs(min, max)",
  [WidgetStatType.MAX_ABS]: "Max of abs(min, max)",
  [WidgetStatType.P95]: "95th percentile",
  [WidgetStatType.P90]: "90th percentile",
  [WidgetStatType.p10]: "10th percentile",
  [WidgetStatType.p05]: "5th percentile",
};
