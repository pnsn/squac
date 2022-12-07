import { Pipe, PipeTransform } from "@angular/core";

/**
 * Transforms numeric value into string using toPrecision
 *
 * @param {number | string} value - number to format
 * @param {number} precision - default 4, precision to use
 * @returns {string} formatted value
 * @example Invoking 1.93842 | precision:3 in a template will produce 1.93
 */
@Pipe({
  name: "precision",
})
export class PrecisionPipe implements PipeTransform {
  transform(value: number | string, precision = 4): string {
    switch (typeof value) {
      case "number":
        return value.toPrecision(precision);
      case "string":
        try {
          const val = +value;
          return val.toPrecision(precision);
        } catch {
          return "";
        }
      default:
        return "";
    }
  }
}
