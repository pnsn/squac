import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";

export class UserNotification {

  constructor(
    public id : number,
    public owner: number,
    public type: string,
    public contactId: number,
    public level: number,
  ) {

  }
}

export interface ApiGetNotification {
 id: number,
 url: string,
 notification_type: string, //email, sms, slack
 contact: number,
 level: number, //1, 2, 3
 created_at: string,
 updated_at: string,
 user_id: string
}

export interface ApiPostNotification{
  notification_type: string, //email, sms, slack
  contact: number,
  level: number //1, 2, 3
}

@Injectable({
  providedIn: 'root',
})
export class UserNotificationAdapter implements Adapter<UserNotification> {
  adaptFromApi(item: ApiGetNotification): UserNotification {
    return new UserNotification(
      item.id,
      +item.user_id,
      item.notification_type,
      item.contact,
      item.level
    );
  }

  adaptToApi(item: UserNotification) : ApiPostNotification {
    return {
      notification_type: item.type, //email, sms, slack
      contact: item.contactId,
      level: item.level
    }
  }
}