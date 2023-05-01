import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { PasswordResetService } from "squacapi";
import { Router, ActivatedRoute } from "@angular/router";

/**
 * Password reset component
 */
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
  email = new FormControl<string>("", [Validators.required, Validators.email]);
  newPassword = new FormControl<string>("", [
    Validators.required,
    Validators.minLength(6),
  ]);
  passwordConfirm = new FormControl<string>("", [Validators.required]);

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /** listen to query params */
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

  /**
   * Send email to user to reset password
   */
  sendEmail(): void {
    /** low security method to stop too many attemps */
    if (this.attempts > 4) {
      this.error = "Too many attempts, contact pnsn@uw.edu to reset password";
    }
    this.passwordResetService.resetPassword(this.email.value).subscribe({
      next: (response) => {
        this.emailSent = !!response;
        this.attempts++;
      },
      error: (error) => {
        this.error = error;
      },
    });
  }

  /**
   * Send token to user
   *
   * @param token token from email
   */
  sendToken(token: string): void {
    this.passwordResetService.validateToken(token).subscribe({
      next: (response) => {
        // go to next step
        this.tokenValidated = !!response;
        this.error = "";
      },
      error: (error) => {
        this.error = error;
      },
    });
  }

  /**
   * Check passwords match and send to squacapi
   */
  confirmPassword(): void {
    const password1 = this.newPassword.value;
    const password2 = this.passwordConfirm.value;

    if (password1 === password2) {
      this.passwordResetService.confirmPassword(password1).subscribe({
        next: () => {
          this.router.navigate(["/login"]);
          this.error = "";
        },
        error: (error) => {
          this.error = error;
        },
      });
    }
  }
}
