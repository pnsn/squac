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
  emailSent: boolean = false; //has email been sent
  tokenValidated: boolean = false; //has token been validated
  error: string; //error message
  hide: boolean = true; //show/hide password
  attempts : number = 0; //soft block for too many
  token: string; //the token

  constructor(
    private passwordResetService : PasswordResetService,
    private router: Router,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.token = params.token;
        if(this.token) {
          this.emailSent = true;
          this.sendToken(this.token);
        } else {
          this.emailSent = false;
        }
    });
  }

  email= new FormControl('', [
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

  sendEmail() {
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

  sendToken(token : string) {
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
        this.router.navigate(['/login']);
      },
      error => {
        this.error = error;
        console.log("error in password reset", error);
      }
    );
  }
}
