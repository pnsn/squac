import { Injectable } from "@angular/core";
import { Adapter, ReadTrigger, WriteTrigger } from "../interfaces";
import { Trigger as ApiTrigger } from "@pnsn/ngx-squacapi-client";
import { Alert, Monitor } from "../models";

/**
 *
 */
export class Trigger {
  constructor(
    public id: number,
    public monitorId: number,
    public valueOperator: ApiTrigger.ValueOperatorEnum | undefined, //outsideof, within, ==, <, <=, >, >=
    public numChannels: number,
    public numChannelsOperator: ApiTrigger.NumChannelsOperatorEnum | undefined, //any, ==, <, >
    public alertOnOutOfAlarm: boolean,
    public emailList: string, //comma separated
    public val1: number,
    public val2?: number
  ) {}
  /**
   *
   */
  static get modelName(): string {
    return "Trigger";
  }

  // get conditionString(): string {
  //   return `Alarm if ${this.num_channels_operator} ${this.num_channels}`
  // }
  lastAlarm?: Alert;
  monitor?: Monitor;
}

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class TriggerAdapter
  implements Adapter<Trigger, ReadTrigger, WriteTrigger>
{
  /**
   *
   * @param item
   */
  adaptFromApi(item: ReadTrigger): Trigger {
    const trigger = new Trigger(
      item.id ? +item.id : 0,
      item.monitor,
      item.value_operator, //outsideof, within, ==, <, <=, >, >=
      item.num_channels,
      item.num_channels_operator, //any, ==, <, >
      item.alert_on_out_of_alarm,
      item.email_list, //comma separated
      item.val1,
      item.val2
    );
    return trigger;
  }

  /**
   *
   * @param item
   */
  adaptToApi(item: Trigger): WriteTrigger {
    return {
      monitor: item.monitorId,
      val1: item.val1,
      val2: item.val2,
      value_operator: item.valueOperator,
      num_channels: item.numChannels,
      num_channels_operator: item.numChannelsOperator,
      alert_on_out_of_alarm: item.alertOnOutOfAlarm,
      email_list: item.emailList,
    };
  }
}
