import { FormControl, FormGroup } from "@angular/forms";

/** Password form fields */
export interface PasswordsForm {
  /** user's new password */
  password: FormControl<string>;
  /** password that should match other */
  confirm: FormControl<string>;
}

/** User edit form fields */
export interface UserForm {
  /** user's first name */
  firstname: FormControl<string>;
  /** user's last name */
  lastname: FormControl<string>;
  /** user's password */
  passwords: FormGroup<PasswordsForm>;
}
