import { ResourceModel } from "../interfaces";
import {
  Trigger as ApiTrigger,
  WriteOnlyTriggerSerializer,
  ReadOnlyTriggerSerializer,
} from "@pnsn/ngx-squacapi-client";
import { Alert, Monitor } from ".";

/**
 * Describes a trigger
 */
export class Trigger extends ResourceModel<
  ApiTrigger | ReadOnlyTriggerSerializer,
  WriteOnlyTriggerSerializer
> {
  monitorId: number;
  valueOperator: ApiTrigger.ValueOperatorEnum; //outsideof, within, ==, <, <=, >, >=
  numChannels: number;
  numChannelsOperator: ApiTrigger.NumChannelsOperatorEnum; //any, ==, <, >
  alertOnOutOfAlarm: boolean;
  emailList: string; //comma separated
  val1: number;
  val2?: number;
  lastAlarm?: Alert;
  monitor?: Monitor;

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Trigger";
  }

  override fromRaw(data: ApiTrigger | ReadOnlyTriggerSerializer): void {
    super.fromRaw(data);

    Object.assign(this, {
      monitorId: data.monitor,
      valueOperator: data.value_operator, //outsideof, within, ==, <, <=, >, >=
      numChannels: data.num_channels,
      numChannelsOperator: data.num_channels_operator, //any, ==, <, >
      alertOnOutOfAlarm: data.alert_on_out_of_alarm,
      emailList: data.email_list, //comma separated
    });
  }

  toJson(): WriteOnlyTriggerSerializer {
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
