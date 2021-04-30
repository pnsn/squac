import { Threshold } from '@features/widgets/models/threshold';
import { defer } from 'rxjs';

// App wide helper functions

// helps when testing responses to observables
export function fakeAsyncResponse<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export function mostRecent(values): number {
  values.sort((a, b) => {
    return new Date(a.starttime).getTime() - new Date(b.starttime).getTime();
  });

  return values[values.length - 1].value;
}

// Calculates the median for the channel
export function median(values): number {
  const midIndex = values.length / 2 - 0.5;
  let med: number;

  if (midIndex % 1 === 0) {
    med = values[midIndex].value;
  } else {
    med = (values[midIndex - 0.5].value + values[midIndex - 0.5].value) / 2;
  }

  return med;
}

// Calculates the average value for the channel
export function average(values): number {
  let sum = 0;
  for (const value of values) {
    sum += value.value;
  }
  const ave = sum / values.length;
  return ave;
}

// // Returns requested percentile, probably
export function percentile(values, percent: number): number {
  const index = Math.ceil((percent / 100) * values.length);
  return index === values.length ? values[index - 1] : values[index];
}

// Returns the channel's maximum value
export function max(values): number {
  return values[values.length - 1].value;
}

// Returns the channel's minimum value
export function min(values): number {
  return values[0].value;
}

// returns true if in threshold, false if outside or no thresholds
export function checkThresholds(threshold: Threshold, value: number): boolean {
  let withinThresholds = true;
  if (threshold.max !== null && value !== null && value > threshold.max) {
    withinThresholds = false;
  }
  if (threshold.min !== null && value !== null && value < threshold.min) {
    withinThresholds = false;
  }

  // TODO: is no thresholds in or out
  if (threshold.min === null && threshold.max === null) {
    withinThresholds = false;
  }
  return withinThresholds;
}
