import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'measurement'
})
export class MeasurementPipe implements PipeTransform {
  // most recent?
  // Calculates the values for the channel
  private sort(values): Array<any> {
    if ( !values || values.length === 0 ) {
      values.sort((a, b) => a.value - b.value);
    }
    return values;
  }

// Calculates the median for the channel
private median(values): number {

  const mid = values.length / 2 - 0.5;
  let median: number;

  if (mid % 1 === 0) {
    median = values[mid].value;
  } else {
    median = (values[mid - .5].value + values[mid - .5].value) / 2;
  }

  return median;
}

// Calculates the average value for the channel
private average(values): number {

  let sum = 0;
  for (const value of values) {
    sum += value.value;
  }
  const average = sum / values.length;
  return average;
}

// // Returns requested percentile, probably
// private percentile(values, percentile : number) : number {
//   let index = Math.ceil(percentile / 100 * values.length);
//   return index == values.length ? values[index - 1] : values[index];
// }

// Returns the channel's maximum value
private max(values): number {
  return values[values.length - 1];
}

// Returns the channel's minimum value
private min(values): number {
  return values[0];
}

// TODO: handle stattypesthat are unknown
transform(values: any, type: any): any {
  if (values && values.length > 0) {
    const sortedValues = this.sort(values);
    switch (type) {
        case 1:
        return this.average(sortedValues);

        case 2:
          return this.median(sortedValues);

        case 3:
          return this.min(sortedValues);

        case 4:
          return this.max(sortedValues);

        case 5:
          return sortedValues.length;
// 6-10 are percentiles
// 13 is raw
        default: // most recent
          return values[values.length - 1].value;
      }
  } else {
    return null;
  }
}
}
