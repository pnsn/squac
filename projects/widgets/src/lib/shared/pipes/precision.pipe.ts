import { Pipe, PipeTransform } from "@angular/core";

/**
 * Pipe to transform numbers to a given precision
 */
@Pipe({
  name: "precision",
})
export class PrecisionPipe implements PipeTransform {
  /**
   * Transforms numeric value into string using toPrecision
   *
   * @param value - number to format
   * @param  precision - default 4, precision to use
   * @returns formatted value
   * @example Invoking 1.93842 | precision:3 in a template will produce 1.93
   */
  transform(value: number | string, precision = 4): string {
    const val = +value;
    if (typeof value === "number" || !Number.isNaN(val)) {
      return val.toPrecision(precision);
    }
    return "";
  }
}
