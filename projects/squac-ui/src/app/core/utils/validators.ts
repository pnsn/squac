import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";

/**
 * Checks that the form control has valid regex
 *
 * @returns validator function
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

/**
 * Checks that at least one of the form fields has a value
 *
 * @param fields array of form field names
 * @returns function that resolves to true if at least one field is populated
 */
export function atLeastOneValidator(fields: string[]): ValidatorFn {
  return (formGroup: FormGroup<any>): ValidationErrors | null => {
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
