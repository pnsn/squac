import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable } from 'rxjs';

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

  // tells squac to send an invite to existing user
  sendInviteToUser(user: number): Observable<any>{
    return this.squacApi.post(this.url + 'invite/', {user});
  }

  // sends registration info to squac
  registerUser(firstname: string, lastname: string,  token: string, password: string): Observable<any>{
    return this.squacApi.post(this.url + 'register/', {firstname, lastname, token, password});
  }

}
