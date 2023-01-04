import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Validators,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
} from "@angular/forms";
import { InviteService } from "squacapi";

/**
 * User edit component after creation
 */
@Component({
  selector: "user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
})
export class UserEditComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inviteService: InviteService
  ) {}
  tokenValidated = false; // has token been validated
  error: string; // error message
  hide = true; // show/hide password
  attempts = 0; // soft block for too many
  token: string; // the token
  userForm: UntypedFormGroup;

  /** init form */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params["token"];
    });

    this.userForm = new UntypedFormGroup({
      firstName: new UntypedFormControl("", [Validators.required]),
      lastName: new UntypedFormControl("", [Validators.required]),
      passwords: new UntypedFormGroup(
        {
          password: new UntypedFormControl("", [
            Validators.minLength(8),
            Validators.required,
          ]),
          confirm: new UntypedFormControl("", [
            Validators.minLength(8),
            Validators.required,
          ]),
        },
        [this.passwordValidator]
      ),
    });
  }

  /**
   * Check passwords match
   *
   * @param group form group
   * @returns validator function
   */
  passwordValidator(group: UntypedFormGroup): ValidationErrors | null {
    return group.value.password &&
      group.value.confirm &&
      group.value.password === group.value.confirm
      ? null
      : { mismatch: true };
  }

  /**
   * Send password and user information to squacapi
   */
  sendPassword(): void {
    const values = this.userForm.value;
    const password1 = values.passwords.password;
    const password2 = values.passwords.confirm;

    if (password1 !== password2) {
      return;
    }
    this.inviteService
      .registerUser(values.firstName, values.lastName, this.token, password1)
      .subscribe({
        next: (response) => {
          // go to next step
          this.router.navigate(["/login"]);
          this.tokenValidated = !!response;
        },
        error: (error) => {
          this.error = error;
        },
      });
  }
}
