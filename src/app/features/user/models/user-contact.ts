import { Injectable } from '@angular/core';
import { Adapter } from '@core/models/adapter';

export class UserContact {

  constructor(
    public id: number,
    public email: string,
    public sms: string,
    public name: string
  ) {

  }
}

export interface ApiGetContact {
 id: number;
 url: string;
 email_value: string;
 sms_value: string;
 created_at: string;
 updated_at: string;
 user_id: string;
 name: string;
}

export interface ApiPostContact{
  email_value?: string;
  sms_value?: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserContactAdapter implements Adapter<UserContact> {
1;
  adaptFromApi(item: ApiGetContact): UserContact {
    return new UserContact(
      item.id,
      item.email_value,
      item.sms_value,
      item.name
    );
  }
  adaptToApi(item: UserContact): ApiPostContact {
    return {
      email_value: item.email ? item.email : '',
      sms_value: item.sms ? item.sms : '',
      name: item.name
    };
  }
}
