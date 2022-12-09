import { FormControl } from "@angular/forms";

export interface ThresholdForm {
  dimension?: FormControl<string>;
  min: FormControl<number>;
  max: FormControl<number>;
  metricId: FormControl<number>;
}
