import { WidgetStatType } from "../enums";

export const WIDGET_STAT_TYPE_NAMES: { [key in WidgetStatType]: string } = {
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
