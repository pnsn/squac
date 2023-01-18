import { ReadTrigger, WriteTrigger } from "../interfaces";
import { Trigger as ApiTrigger } from "@pnsn/ngx-squacapi-client";
import { Alert, Monitor } from ".";

/**
 * Describes a trigger
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
   * @returns model name
   */
  static get modelName(): string {
    return "Trigger";
  }

  // get conditionString(): string {
  //   return `Alarm if ${this.num_channels_operator} ${this.num_channels}`
  // }
  lastAlarm?: Alert;
  monitor?: Monitor;

  /**
   *
   * @param item
   */
  static deserialize(item: ReadTrigger): Trigger {
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
   */
  serialize(): WriteTrigger {
    return {
      monitor: this.monitorId,
      val1: this.val1,
      val2: this.val2,
      value_operator: this.valueOperator,
      num_channels: this.numChannels,
      num_channels_operator: this.numChannelsOperator,
      alert_on_out_of_alarm: this.alertOnOutOfAlarm,
      email_list: this.emailList,
    };
  }
}
