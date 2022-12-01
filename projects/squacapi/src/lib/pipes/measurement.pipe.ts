import { Pipe, PipeTransform } from "@angular/core";
import { Aggregate, Archive, Measurement } from "../models";
import {
  average,
  median,
  min,
  max,
  percentile,
  mostRecent,
  absvalue,
} from "../utils/measurement-values.utils";

type MeasurementTypes = Measurement | Aggregate | Archive;
@Pipe({
  name: "measurement",
})
export class MeasurementPipe implements PipeTransform {
  // Calculates the values for the channel
  private sort(values: MeasurementTypes[]): MeasurementTypes[] {
    return values.sort((a, b) => a.value - b.value);
  }

  // TODO: handle stattypesthat are unknown
  transform(values: MeasurementTypes[], type: string): number {
    if (values && values.length > 0) {
      const sortedValues = this.sort(values.slice());
      switch (type) {
        case "ave":
          return average(sortedValues);

        case "med":
          return median(sortedValues);

        case "min":
          return min(sortedValues);

        case "max":
          return max(sortedValues);

        case "num_samps":
          return sortedValues.length;

        case "p99":
          return percentile(sortedValues, 99);

        case "p90":
          return percentile(sortedValues, 90);

        case "p10":
          return percentile(sortedValues, 10);

        case "p05":
          return percentile(sortedValues, 5);

        case "minabs":
          return absvalue(sortedValues, "min");

        case "maxabs":
          return absvalue(sortedValues, "max");

        case "latest":
          return mostRecent(values);

        default: // most recent
          return mostRecent(values);
      }
    } else {
      return null;
    }
  }
}
