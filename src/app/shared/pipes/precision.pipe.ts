import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "precision",
})
export class PrecisionPipe implements PipeTransform {
  transform(value: number, precision = 4): unknown {
    return value.toPrecision(precision);
  }
}
