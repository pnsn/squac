import { Pipe, PipeTransform } from "@angular/core";
import { MeasurementTypes } from "../types";
import {
  average,
  median,
  min,
  max,
  percentile,
  mostRecent,
  absvalue,
  sum,
} from "../utils/measurement-values.utils";

export type MeasurementTransformTypes =
  | "avg"
  | "ave"
  | "mean"
  | "med"
  | "median"
  | "min"
  | "max"
  | "count"
  | "num_samps"
  | "sum"
  | "p95"
  | "p90"
  | "p10"
  | "p05"
  | "minabs"
  | "maxabs"
  | "recent"
  | "latest";
/**
 * Transforms arrays of measurements into single values
 */
@Pipe({
  name: "measurement",
})
export class MeasurementPipe implements PipeTransform {
  /**
   * Transforms array of measurements into a single value
   *
   * @param values measurement values
   * @param type type of value to transform into
   * @returns resulting value
   */
  transform(
    values: MeasurementTypes[],
    type: MeasurementTransformTypes
  ): number {
    if (values && values.length > 0) {
      switch (type) {
        case "avg":
          return average(values);

        case "ave":
          return average(values);

        case "mean":
          return average(values);

        case "med":
          return median(values);

        case "median":
          return median(values);

        case "min":
          return min(values);

        case "max":
          return max(values);

        case "count":
          return values.length;

        case "num_samps":
          return values.length;

        case "sum":
          return sum(values);

        case "p95":
          return percentile(values, 95);

        case "p90":
          return percentile(values, 90);

        case "p10":
          return percentile(values, 10);

        case "p05":
          return percentile(values, 5);

        case "minabs":
          return absvalue(values, "min");

        case "maxabs":
          return absvalue(values, "max");

        case "recent":
          return mostRecent(values);

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
