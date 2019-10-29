import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService} from './auth.service';
import { onErrorResumeNext, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

// This component handles the login page
export class AuthComponent implements OnInit {
  isLoading = false; // Currently loading/in progress?
  error: string = null; // Has there been an error?
  hide = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  // After user presses submit
  onSubmit(form: NgForm) {

    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    // Try to log in
    this.authService.login(email, password).subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['/dashboards']);
      },
      error => {
        this.error = 'An error occured';
        this.isLoading = false;
      }
    );

    form.reset();
  }

}
