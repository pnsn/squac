import {
  IntervalType,
  MonitorStatType,
  NumChannelsOperator,
  ValueOperator,
} from "../types";

export const INTERVAL_TYPES: IntervalType[] = [
  "minute",
  "hour",
  "day",
  "last n",
];

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

export const NUM_CHANNELS_OPERATORS: {
  [key in NumChannelsOperator]: string;
} = {
  any: "any",
  all: "all",
  "==": "exactly",
  ">": "more than",
  "<": "less than",
};
