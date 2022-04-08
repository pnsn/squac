import { Injectable } from '@angular/core';
import { Adapter } from '@core/models/adapter';

export class Trigger {
  constructor(
    public id: number,
    public monitorId: number,
    public value_operator: string, //outsideof, within, ==, <, <=, >, >=
    public num_channels: number,
    public num_channels_operator: string, //any, ==, <, >
    public owner: number,
    public alert_on_out_of_alarm: boolean,
    public email_list: string, //comma separated
    public val1: number,
    public val2?: number
  ) {
  }
  static get modelName() {
    return 'Trigger';
  }

}

export interface ApiGetTrigger {
  id: number;
  url: string;
  monitor: number;
  val1: number;
  val2: number;
  value_operator: string; //outsideof, within, ==, <, <=, >, >=
  num_channels: number;
  num_channels_operator: string; //any, ==, <, >
  created_at: string;
  updated_at: string;
  user_id: string;
  alert_on_out_of_alarm: boolean;
  email_list: string //comma separated
}

export interface ApiPostTrigger {
  monitor: number;
  val1: number;
  val2: number;
  value_operator: string; //outsideof, within, ==, <, <=, >, >=
  num_channels: number;
  num_channels_operator: string; //any, ==, <, >
  alert_on_out_of_alarm: boolean;
  email_list: string //comma separated
}

@Injectable({
  providedIn: 'root',
})
export class TriggerAdapter implements Adapter<Trigger> {
  adaptFromApi(item: ApiGetTrigger): Trigger {
    return new Trigger(
      item.id,
      item.monitor,
      item.value_operator, //outsideof, within, ==, <, <=, >, >=
      item.num_channels,
      item.num_channels_operator, //any, ==, <, >
      +item.user_id,
      item.alert_on_out_of_alarm,
      item.email_list, //comma separated
      item.val1,
      item.val2
    );
  }

  adaptToApi(item: Trigger): ApiPostTrigger {
    return {
      monitor: item.monitorId,
      val1: item.val1,
      val2: item.val2,
      value_operator: item.value_operator,
      num_channels: item.num_channels,
      num_channels_operator: item.num_channels_operator,
      alert_on_out_of_alarm: item.alert_on_out_of_alarm,
      email_list: item.email_list 
    };
  }
}

