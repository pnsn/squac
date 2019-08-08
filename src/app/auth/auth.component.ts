import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService , AuthResponseData} from './auth.service';
import { onErrorResumeNext, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode : boolean = true;
  isLoading : boolean = false;
  error : string = null;
  constructor(
    private authService : AuthService,
    private router : Router
  ) { }

  ngOnInit() {
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form : NgForm) {

    if (!form.valid) {
      return;
    } 

    const email = form.value.email;
    const password = form.value.password;

    let authObs : Observable<AuthResponseData>;

    this.isLoading = true;
    if(this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error => {
        this.error = 'An error occured';
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

}