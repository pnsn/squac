import { WidgetStatType } from "squacapi";

/** Names of widget stat types */
export const WIDGET_STAT_TYPE_NAMES: { [key in WidgetStatType]: string } = {
  ["mean"]: "Average",
  ["latest"]: "Most Recent",
  ["num_samps"]: "Sample Count",
  ["median"]: "Median",
  ["min"]: "Minimum",
  ["max"]: "Maximum",
  ["minabs"]: "Min of abs(min, max)",
  ["maxabs"]: "Max of abs(min, max)",
  ["p95"]: "95th percentile",
  ["p90"]: "90th percentile",
  ["p10"]: "10th percentile",
  ["p05"]: "5th percentile",
};
