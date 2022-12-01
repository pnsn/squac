export const WidgetStatType = [
  "mean",
  "latest",
  "num_samps",
  "median",
  "min",
  "max",
  "minabs",
  "maxabs",
  "p95",
  "p90",
  "p10",
  "p05",
] as const;

export type WidgetStatType = typeof WidgetStatType[number];
