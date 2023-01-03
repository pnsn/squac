import { FormControl } from "@angular/forms";

/** Threshold form */
export interface ThresholdForm {
  /** threshold dimension */
  dimension?: FormControl<string>;
  /** min value */
  min: FormControl<number>;
  /** max value */
  max: FormControl<number>;
  /** metric id */
  metricId: FormControl<number>;
}
