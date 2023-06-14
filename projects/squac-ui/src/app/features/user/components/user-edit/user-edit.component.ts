import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Validators,
  ValidationErrors,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { InviteService } from "squacapi";
import { PasswordsForm, UserForm } from "./interfaces";

/**
 * User edit component after creation
 */
@Component({
  selector: "user-edit",
  templateUrl: "./user-edit.component.html",
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
  userForm: FormGroup<UserForm>;

  /** init form */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params["token"];
    });

    this.userForm = new FormGroup({
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      passwords: new FormGroup(
        {
          password: new FormControl("", [
            Validators.minLength(8),
            Validators.required,
          ]),
          confirm: new FormControl("", [
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
  passwordValidator(group: FormGroup<PasswordsForm>): ValidationErrors | null {
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
      .registerUser(values.firstname, values.lastname, this.token, password1)
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
