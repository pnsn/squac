import { MeasurementTypes } from "../types/measurement-types";

/**
 * Sorts measurements by value, lowest to highest
 *
 * @param values unsorted measurements
 * @returns sorted measurements
 */
export function sort(values: MeasurementTypes[]): MeasurementTypes[] {
  return values.slice().sort((a, b) => a.value - b.value);
}

/**
 * Finds the most recent measurement
 *
 * @param values measurements
 * @returns Most recent of the measurements
 */
export function mostRecent(values: MeasurementTypes[]): number {
  values.sort((a, b) => {
    return new Date(a.starttime).getTime() - new Date(b.starttime).getTime();
  });

  return values[values.length - 1].value;
}

/**
 * Finds the median measurement or midpoint between middle two measurements
 *
 * @param values measurement values
 * @returns median measurement
 */
export function median(values: MeasurementTypes[]): number {
  const sortedValues = sort(values);
  const midIndex = sortedValues.length / 2 - 0.5;
  let med: number = undefined;

  if (midIndex % 1 === 0) {
    med = sortedValues[midIndex].value;
  } else {
    const upperValue: number = sortedValues[midIndex + 0.5].value;
    const lowerValue: number = sortedValues[midIndex - 0.5].value;
    med = (lowerValue + upperValue) / 2;
  }

  return med;
}

/**
 * Returns sum of measurements
 *
 * @param values measurements
 * @returns sum of measurement values
 */
export function sum(values: MeasurementTypes[]): number {
  let sum = 0;
  for (const value of values) {
    sum += value.value;
  }
  return sum;
}

/**
 * Calculates average value for the measurements
 *
 * @param values measurements
 * @returns average of the values
 */
export function average(values: MeasurementTypes[]): number {
  const avg = sum(values) / values.length;
  return avg;
}

/**
 * Returns value at given percentile
 *
 * @param values measurement values
 * @param percent percentile value
 * @returns value at percentile
 */
export function percentile(
  values: MeasurementTypes[],
  percent: number
): number {
  const count = values.length;
  const sortedValues = sort(values);
  const index = Math.ceil((percent / 100) * count);
  return index === count
    ? sortedValues[index - 1].value
    : sortedValues[index].value;
}

/**
 * Finds the largest value of the measurements
 *
 * @param values measurement values
 * @returns maximum value
 */
export function max(values: MeasurementTypes[]): number {
  return sort(values)[values.length - 1].value;
}

/**
 * Finds the lowest value of the measurements
 *
 * @param values measurement values
 * @returns minimum value of the measurements
 */
export function min(values: MeasurementTypes[]): number {
  return sort(values)[0].value;
}

// Returns the max or min (type) of the absolute value of the min and max
// Most extreme value of the data
/**
 * Returns the max or min of the absolute value of the min and max
 *
 * @param values measurement values to calculate
 * @param type min or max value to calculate
 * @returns most extreme value of the data
 */
export function absvalue(
  values: MeasurementTypes[],
  type: "min" | "max"
): number {
  const maxValue = max(values);
  const minValue = min(values);

  const maxabs = Math.abs(maxValue);
  const minabs = Math.abs(minValue);

  if (type === "min") {
    return Math.min(minabs, maxabs);
  }

  return Math.max(minabs, maxabs);
}
