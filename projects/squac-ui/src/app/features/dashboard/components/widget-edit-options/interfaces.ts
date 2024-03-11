import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { GradientColorOption, SolidColorOption } from "widgets";

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

/** form for selecting color options */
export interface OptionForm {
  /** in range colors */
  inRange: FormControl<GradientColorOption | SolidColorOption>;
  /** out of range colors */
  outOfRange: FormControl<GradientColorOption | SolidColorOption>;
  /** number of splits for coloring */
  numSplits: FormControl<number>;
  /** if true, reverse the order of colors */
  reverseColors: FormControl<boolean>;
}
/** form for all widget options */
export interface OptionsForm {
  /** threshold forms */
  thresholdArray: FormArray<FormGroup<ThresholdForm>>;
  /** widget config options */
  options: FormGroup<OptionForm>;
}
