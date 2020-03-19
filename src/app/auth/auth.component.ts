import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService} from './auth.service';
import { onErrorResumeNext, Observable, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

// This component handles the login page
export class AuthComponent implements OnInit, OnDestroy {
  isLoading = false; // Currently loading/in progress?
  error: string = null; // Has there been an error?
  hide = true;
  subscription = new Subscription();
  authForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Form submit
  onSubmit() {

    if (!this.authForm.valid) {
      return;
    }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    this.isLoading = true;

    // Send data and log user in
    const loginSub = this.authService.login(email, password).subscribe(
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
