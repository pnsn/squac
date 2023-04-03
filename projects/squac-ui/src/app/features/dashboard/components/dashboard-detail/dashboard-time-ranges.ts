import { TimeRange } from "@shared/components/date-select/time-range.interface";

/** Default time ranges for dashboard */
export const DATE_PICKER_TIMERANGES: TimeRange[] = [
  {
    amount: 1,
    unit: "hour",
    label: "Last hour",
  },
  {
    amount: 6,
    unit: "hours",
    label: "Last 6 hours",
  },
  {
    amount: 12,
    unit: "hours",
    label: "Last 12 hours",
  },
  {
    amount: 1,
    unit: "day",
    label: "Last day",
  },
  {
    amount: 1,
    unit: "week",
    label: "Last week",
  },
  {
    amount: 1,
    unit: "month",
    label: "Last month",
  },
];
