import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService} from '../auth.service';
import { onErrorResumeNext, Observable, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

// This component handles the login page
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false; // Currently loading/in progress?
  error: string = null; // Has there been an error?
  hide = true;
  subscription = new Subscription();
  loginForm: FormGroup;

  constructor(
    private loginService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Form submit
  onSubmit() {

    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.isLoading = true;

    // Send data and log user in
    const loginSub = this.loginService.login(email, password).subscribe(
      response => {
        this.isLoading = false;
        this.router.navigate(['/dashboards']);
      },
      error => {
        this.error = 'An error occured';
        this.isLoading = false;
      }
    );

    this.subscription.add(loginSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
