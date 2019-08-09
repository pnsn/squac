import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService , AuthResponseData} from './auth.service';
import { onErrorResumeNext, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isLoading : boolean = false;
  error : string = null;

  constructor(
    private authService : AuthService,
    private router : Router
  ) { }

  ngOnInit() {
  }

  onSubmit(form : NgForm) {

    if (!form.valid) {
      return;
    } 

    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    this.authService.login(email, password).subscribe(
      resData => {
        console.log("dashboard!");
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