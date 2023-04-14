import {
  IntervalType,
  MonitorStatType,
  NumChannelsOperator,
  ValueOperator,
} from "../types";

/** Monitor interval types and the display text */
export const INTERVAL_TYPES: {
  [key in IntervalType]: string;
} = {
  minute: "minute",
  hour: "hour",
  day: "day",
  "last n": "measurement",
};

/** Monitor stat options and display text  */
export const MONITOR_STATS: {
  [key in MonitorStatType]: string;
} = {
  count: "count",
  avg: "average",
  sum: "sum",
  min: "minimum",
  max: "maximum",
  minabs: "minabs",
  maxabs: "maxabs",
  p90: "p90",
  p95: "p95",
  median: "median",
};

/** Monitor value operator options and display text */
export const VALUE_OPERATORS: {
  [key in ValueOperator]: string;
} = {
  outsideof: "outside of",
  within: "within",
  "==": "equal to",
  "<": "less than",
  "<=": "less than or equal to",
  ">": "greater than",
  ">=": "greater than or equal to",
};

/** Monitor number of channels operators and display text */
export const NUM_CHANNELS_OPERATORS: {
  [key in NumChannelsOperator]: string;
} = {
  any: "any",
  all: "all",
  "==": "exactly",
  ">": "more than",
  "<": "less than",
};
