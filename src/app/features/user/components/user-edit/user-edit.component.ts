import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Validators,
  FormControl,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { InviteService } from "@features/user/services/invite.service";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
})
export class UserEditComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inviteService: InviteService,
    private formBuilder: FormBuilder
  ) {}
  tokenValidated = false; // has token been validated
  error: string; // error message
  hide = true; // show/hide password
  attempts = 0; // soft block for too many
  token: string; // the token
  userForm: FormGroup;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params.token;
    });

    this.userForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      passwords: new FormGroup(
        {
          password: new FormControl("", [
            Validators.required,
            Validators.minLength(6),
          ]),
          confirm: new FormControl("", [Validators.required]),
        },
        [this.passwordValidator]
      ),
    });
  }

  passwordValidator(group: FormGroup) {
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

  sendPassword() {
    const values = this.userForm.value;
    const password1 = values.passwords.password;
    const password2 = values.passwords.confirm;

    if (password1 !== password2) {
      return;
    }
    this.inviteService
      .registerUser(values.firstName, values.lastName, this.token, password1)
      .subscribe(
        (response) => {
          // go to next step
          this.router.navigate(["/login"]);
          this.tokenValidated = !!response;
        },
        (error) => {
          this.error = error;
        }
      );
  }
}
