import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';

// Service to get user info & reset things
@Injectable({
providedIn: 'root'
})
export class InviteService {
  private url = 'invite/';

  // invite
  // registration both post

  constructor(
    private squacApi: SquacApiService
  ) { }

  sendInviteToUser(user: number) {
    return this.squacApi.post(this.url + 'invite/', {user});
  }

  registerUser(firstname: string, lastname: string,  token: string, password: string) {
    return this.squacApi.post(this.url + 'register/', {firstname, lastname, token, password});
  }

}
