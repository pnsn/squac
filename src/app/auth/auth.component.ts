import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
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
  private authForm : FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder : FormBuilder
  ) { }

  ngOnInit() {
    
  }

  // Form submit
  onSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

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
    
    // Empty form
    form.reset();

    this.subscription.add(loginSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
