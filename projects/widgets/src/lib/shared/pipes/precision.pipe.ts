import { Pipe, PipeTransform } from "@angular/core";

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
