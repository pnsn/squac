import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, Validators } from "@angular/forms";
import { PasswordResetService } from "squacapi";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "user-password-reset",
  templateUrl: "./password-reset.component.html",
  styleUrls: ["./password-reset.component.scss"],
})
export class PasswordResetComponent implements OnInit {
  emailSent = false; // has email been sent
  tokenValidated = false; // has token been validated
  error: string; // error message
  hide = true; // show/hide password
  attempts = 0; // soft block for too many
  token: string; // the token

  // set up forms
  email = new UntypedFormControl("", [Validators.required, Validators.email]);
  newPassword = new UntypedFormControl("", [
    Validators.required,
    Validators.minLength(6),
  ]);
  passwordConfirm = new UntypedFormControl("", [Validators.required]);

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params["token"];
      if (this.token) {
        this.emailSent = true;
        this.sendToken(this.token);
      } else {
        this.emailSent = false;
      }
    });
  }

  // send user email to reset password
  sendEmail(): void {
    if (this.attempts > 4) {
      this.error = "Too many attempts, contact pnsn@uw.edu to reset password";
    }
    this.passwordResetService.resetPassword(this.email.value).subscribe(
      (response) => {
        this.emailSent = !!response;
        this.attempts++;
      },
      (error) => {
        this.error = error;
      }
    );
  }

  // try sending again
  resendEmail(): void {
    this.emailSent = false;
    this.tokenValidated = false;
  }

  // tell squac to send token
  sendToken(token: string): void {
    this.passwordResetService.validateToken(token).subscribe(
      (response) => {
        // go to next step
        this.tokenValidated = !!response;
        this.error = "";
      },
      (error) => {
        this.error = error;
      }
    );
  }

  // check passwords match
  confirmPassword(): void {
    const password1 = this.newPassword.value;
    const password2 = this.passwordConfirm.value;

    if (password1 !== password2) {
      return;
    }
    this.passwordResetService.confirmPassword(password1).subscribe(
      () => {
        this.router.navigate(["/login"]);
        this.error = "";
      },
      (error) => {
        this.error = error;
      }
    );
  }
}
