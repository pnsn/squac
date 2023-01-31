import {
  ReadOnlyMonitorDetailSerializer,
  Trigger as ApiTrigger,
} from "@pnsn/ngx-squacapi-client";

export const INTERVAL_TYPES: ReadOnlyMonitorDetailSerializer.IntervalTypeEnum[] =
  ["minute", "hour", "day"];

export const MONITOR_STATS: {
  [key in ReadOnlyMonitorDetailSerializer.StatEnum]: string;
} = {
  count: "count",
  avg: "average",
  sum: "sum",
  min: "minimum",
  max: "maximum",
};

export const VALUE_OPERATORS: {
  [key in ApiTrigger.ValueOperatorEnum]: string;
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
  [key in ApiTrigger.NumChannelsOperatorEnum]: string;
} = {
  any: "any",
  all: "all",
  "==": "exactly",
  ">": "more than",
  "<": "less than",
};
