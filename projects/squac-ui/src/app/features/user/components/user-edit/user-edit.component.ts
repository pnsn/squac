import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Validators,
  UntypedFormControl,
  UntypedFormGroup,
} from "@angular/forms";
import { InviteService } from "squacapi";

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
          confirm: new UntypedFormControl("", [Validators.required]),
        },
        [this.passwordValidator]
      ),
    });
  }

  // check passwords match
  passwordValidator(group: UntypedFormGroup) {
    if (
      group.value.password &&
      group.value.confirm &&
      group.value.password === group.value.confirm
    ) {
      return null;
    } else {
      return { mismatch: true };
    }
  }

  //  send password to squacapi
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
