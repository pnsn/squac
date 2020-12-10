import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService} from '@core/services/auth.service';
import { onErrorResumeNext, Observable, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

// This component handles the login page
export class LoginComponent implements OnInit, OnDestroy {
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

    // Send data and log user in
    const loginSub = this.loginService.login(email, password).subscribe(
      response => {
        this.error = null;
        console.log("login component")
        this.router.navigate(['/dashboards']);
      },
      error => {
        this.error = 'Failed to log in - please try again';
      }
    );

    this.subscription.add(loginSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
