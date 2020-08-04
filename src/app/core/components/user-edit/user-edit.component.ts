import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormControl } from '@angular/forms';
import { InviteService } from '@core/services/invite.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inviteService: InviteService
  ) { }
  tokenValidated = false; // has token been validated
  error: string; // error message
  hide = true; // show/hide password
  attempts = 0; // soft block for too many
  token: string; // the token

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
    });
  }


  sendPassword() {
    const password1 = this.newPassword.value;
    const password2 = this.passwordConfirm.value;

    if (password1 !== password2) {
      return;
    }
    this.inviteService.registerUser(this.token, password1).subscribe(
      response => {
        console.log(response);
        // go to next step
        this.tokenValidated = !!response;
      },
      error => {
        this.error = error;
      }
    );
  }

}
