import { RowMetric } from "./types";

/**
 * Sort function for metric values
 *
 * @param propA first value
 * @param propB second value
 * @returns difference
 */
export const RowMetricComparator = (
  propA: RowMetric,
  propB: RowMetric
): number => {
  if (propA.value === null && propB.value === null) {
    // both are null, treat as equal
    return 0;
  } else if (propA.value === null && propB.value !== null) {
    // treat second value as larger
    return -1;
  } else if (propA.value !== null && propB.value === null) {
    // treat first as larger
    return 1;
  }
  return propA.value - propB.value;
};
