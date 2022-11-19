import { MeasurementTypes } from "../types/measurement-types";

// get most recent value
export function mostRecent(values: MeasurementTypes[]): number {
  values.sort((a, b) => {
    return new Date(a.starttime).getTime() - new Date(b.starttime).getTime();
  });

  return values[values.length - 1].value;
}

// Calculates the median for the channel
export function median(values: MeasurementTypes[]): number {
  const midIndex = values.length / 2 - 0.5;
  let med: number;

  if (midIndex % 1 === 0) {
    med = values[midIndex].value;
  } else {
    const upperValue: number = values[midIndex + 0.5].value;
    const lowerValue: number = values[midIndex - 0.5].value;
    med = (lowerValue + upperValue) / 2;
  }

  return med;
}

// Calculates the average value for the channel
export function average(values: MeasurementTypes[]): number {
  let sum = 0;
  for (const value of values) {
    sum += value.value;
  }
  const ave = sum / values.length;
  return ave;
}

// // Returns requested percentile, probably
export function percentile(
  values: MeasurementTypes[],
  percent: number
): number {
  const index = Math.ceil((percent / 100) * values.length);
  return index === values.length
    ? values[index - 1].value
    : values[index].value;
}

// Returns the channel's maximum value
export function max(values: MeasurementTypes[]): number {
  return values[values.length - 1].value;
}

// Returns the channel's minimum value
export function min(values: MeasurementTypes[]): number {
  return values[0].value;
}

// Returns the max or min (type) of the absolute value of the min and max
// Most extreme value of the data
export function absvalue(values: MeasurementTypes[], type: string): number {
  const maxValue = max(values);
  const minValue = min(values);

  const maxabs = Math.abs(maxValue);
  const minabs = Math.abs(minValue);

  if (type === "min") {
    return Math.min(minabs, maxabs);
  }

  return Math.max(minabs, maxabs);
}
