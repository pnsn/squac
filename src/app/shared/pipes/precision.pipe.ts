import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "precision",
})
export class PrecisionPipe implements PipeTransform {
  transform(value: number, precision = 4): string {
    return typeof value == "number" ? value.toPrecision(precision) : "";
  }
}
