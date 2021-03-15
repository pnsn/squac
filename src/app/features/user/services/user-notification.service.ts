import { Injectable } from '@angular/core';
import { SquacApiService } from '@core/services/squacapi.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserContact , UserContactAdapter} from '../models/user-contact';
import { UserNotification, UserNotificationAdapter } from '../models/user-notification';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {
  private url = 'user/';
  constructor(
    private squacApi: SquacApiService,
    private notificationAdapter: UserNotificationAdapter,
    private contactsAdapter: UserContactAdapter 
  ) { }

  getNotifications() : Observable<UserNotification[]> {
    const path = "notifications/";
    return this.squacApi.get(this.url + path).pipe(
      map( response => response.map(r => this.notificationAdapter.adaptFromApi(r)))
    );
  }

  updateNotification(notification: UserNotification){
    const path = "notifications/";
    const postData = this.notificationAdapter.adaptToApi(notification);

    if(notification.id) {
      return this.squacApi.put(this.url + path, notification.id, postData).pipe(
        map(response => this.notificationAdapter.adaptFromApi(response))
      );
    } else {
      return this.squacApi.post(this.url + path, postData).pipe(
        map(response => this.notificationAdapter.adaptFromApi(response))
      );
    }
  }

  updateContact(contact: UserContact) {
    const path = "contacts/";
    const postData = this.contactsAdapter.adaptToApi(contact);

    if(contact.id) {
      return this.squacApi.put(this.url + path, contact.id, postData).pipe(
        map(response => this.contactsAdapter.adaptFromApi(response))
      );
    } else {
      return this.squacApi.post(this.url + path, postData).pipe(
        map(response => this.contactsAdapter.adaptFromApi(response))
      );
    }
  }
}
