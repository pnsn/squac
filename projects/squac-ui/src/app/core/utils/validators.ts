import {
  AbstractControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";

// return true if control has valid regex
/**
 *
 */
export function regexValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let isValid = true;
    if (control.value === "") {
      return null;
    }
    try {
      new RegExp(control.value);
    } catch (e) {
      isValid = false;
    }
    return isValid ? null : { invalidRegex: { message: "Invalid regex" } };
  };
}

// return true if at least input from fiels is filled
/**
 *
 * @param fields
 */
export function atLeastOneValidator(fields: string[]): ValidatorFn {
  return (formGroup: UntypedFormGroup): ValidationErrors | null => {
    const values = formGroup.value;

    const isValid = fields.some((fieldName) => {
      const value = values[fieldName];
      return !!value;
    });

    return isValid
      ? null
      : { atLeastOne: { message: "At least one regex required" } };
  };
}
