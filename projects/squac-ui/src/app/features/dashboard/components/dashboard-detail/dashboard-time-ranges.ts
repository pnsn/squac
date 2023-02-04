import { TimeRange } from "@shared/components/date-select/time-range.interface";

/** Default time ranges for dashboard */
export const DATE_PICKER_TIMERANGES: TimeRange[] = [
  {
    amount: 1,
    unit: "hour",
  },
  {
    amount: 6,
    unit: "hours",
  },
  {
    amount: 12,
    unit: "hours",
  },
  {
    amount: 1,
    unit: "day",
  },
  {
    amount: 1,
    unit: "week",
  },
  {
    amount: 1,
    unit: "month",
  },
];
