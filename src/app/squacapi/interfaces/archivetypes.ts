/**
 * Data types available in SQUAC
 */
export enum ArchiveTypes {
  DAY = "day",
  // HOUR = "hour",
  WEEK = "week",
  MONTH = "month",
  RAW = "raw",
}

/**
 * Stat types available for archive types type
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
  STDEV = "stdev",
}

// dataTypes: any = [
//   { value: "raw", short: "raw", full: "raw data" },
//   { value: "hour", short: "hourly", full: "hour archive" },
//   { value: "day", short: "daily", full: "day archive" },
//   { value: "month", short: "monthly", full: "month archive" },
// ];
