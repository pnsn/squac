import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { PasswordResetService } from '../password-reset.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  emailSent = false; // has email been sent
  tokenValidated = false; // has token been validated
  error: string; // error message
  hide = true; // show/hide password
  attempts = 0; // soft block for too many
  token: string; // the token

  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  newPassword = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  passwordConfirm = new FormControl('', [
    Validators.required
  ]);

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.token = params.token;
        if (this.token) {
          this.emailSent = true;
          this.sendToken(this.token);
        } else {
          this.emailSent = false;
        }
    });
  }

  sendEmail() {
    if (this.attempts > 4) {
      this.error = 'Too many attempts, contact pnsn@uw.edu to reset password';
    }
    this.passwordResetService.resetPassword(this.email.value).subscribe(
      response => {
        // go to next step
        console.log(response);
        this.emailSent = !!response;
        this.attempts++;
      },
      error => {
        this.error = error;
        console.log('error in send email', error);
      }
    );
  }

  resendEmail() {
    this.emailSent = false;
    this.tokenValidated = false;
  }

  sendToken(token: string) {
    this.passwordResetService.validateToken(token).subscribe(
      response => {
        // go to next step
        console.log(response);
        this.tokenValidated = !!response;
      },
      error => {
        this.error = error;
        console.log('error in validate token', error);
      }
    );
  }

  confirmPassword() {
    const password1 = this.newPassword.value;
    const password2 = this.passwordConfirm.value;

    if (password1 !== password2) {
      return;
    }

    this.passwordResetService.confirmPassword(password1).subscribe(
      response => {
        this.router.navigate(['/login']);
      },
      error => {
        this.error = error;
        console.log('error in password reset', error);
      }
    );
  }
}
