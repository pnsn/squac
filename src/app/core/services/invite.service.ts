import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from '@core/services/squacapi.service';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { Organization } from '@core/models/organization';
import { map } from 'rxjs/operators';
import { User } from '@core/models/user';
import { UserService } from './user.service';
import { groupRowsByParents } from '@swimlane/ngx-datatable';

// Service to get user info & reset things
@Injectable({
providedIn: 'root'
})
export class InviteService {
  private url = 'invite/';

  // invite
  // registration both post

  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService
  ) { }

  sendInviteToUser(user: number) {
    return this.squacApi.post(this.url + 'invite/', {user});
  }

  registerUser(token: string, password: string) {
    return this.squacApi.post(this.url + 'register/', {token, password});
  }

}
