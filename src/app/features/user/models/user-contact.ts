import { Injectable } from "@angular/core";
import { Adapter } from "@core/models/adapter";

export class UserContact {

  constructor(
    public id : number,
    public owner: number,
    public email: string,
    public sms: string
  ) {

  }
}

export interface ApiGetContact {
 id: number,
 url: string,
 email_value: string,
 sms_value: string, 
 created_at: string,
 updated_at: string,
 user_id: string
}

export interface ApiPostContact{
  email_value: string,
  sms_value: string
}

@Injectable({
  providedIn: 'root',
})
export class UserContactAdapter implements Adapter<UserContact> {
  adaptFromApi(item: ApiGetContact): UserContact {
    return new UserContact(
      item.id,
      +item.user_id,
      item.email_value,
      item.sms_value
    );
  }

  adaptToApi(item: UserContact) : ApiPostContact {
    return {
      email_value: item.email,
      sms_value: item.sms
    }
  }
}