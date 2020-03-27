import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { PasswordResetService } from '../password-reset.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  emailSent: boolean = false;
  tokenValidated: boolean = false;
  error: string;
  hide: boolean = true;
  attempts : number = 0;
  constructor(
    private passwordResetService : PasswordResetService,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  email= new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  token = new FormControl('', [
    Validators.required,
  ]);

  newPassword = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  passwordConfirm = new FormControl('', [
    Validators.required
  ]);

  sendEmail() {
    console.log("send email")
    if(this.attempts > 4) {
      this.error = "Too many attempts, contact pnsn@uw.edu to reset password";
    }
    const email = this.email.value;
    this.passwordResetService.resetPassword(email).subscribe(
      email => {
        //go to next step
        console.log(email);
        this.emailSent = !!email;
        this.attempts++;
      },
      error => {
        this.error = error;
        console.log("error in send email", error);
      }
    );
  }

  resendEmail() {
    this.emailSent = false;
    this.tokenValidated = false;
  }

  sendToken() {
    const token = this.token.value;
    this.passwordResetService.validateToken(token).subscribe(
      token => {
        //go to next step
        console.log(token);
        this.tokenValidated = !!token;
      },
      error => {
        this.error = error;
        console.log("error in validate token", error);
      }
    );
  }

  confirmPassword() {
    const password1 = this.newPassword.value;
    const password2 = this.passwordConfirm.value;

    if(password1 !== password2) {
      return;
    }

    this.passwordResetService.confirmPassword(password1).subscribe(
      response => {
        //go redircet
        //go to next step
        console.log(response);
        this.router.navigate(['/login']);
      },
      error => {
        this.error = error;
        console.log("error in password reset", error);
      }
    );
  }
}
