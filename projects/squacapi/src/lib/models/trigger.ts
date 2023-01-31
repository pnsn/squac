import { ResourceModel } from "../interfaces";
import {
  Trigger as ApiTrigger,
  WriteOnlyTriggerSerializer,
  ReadOnlyTriggerSerializer,
} from "@pnsn/ngx-squacapi-client";
import { Alert } from ".";
import { NUM_CHANNELS_OPERATORS, VALUE_OPERATORS } from "../constants";

export interface Trigger {
  monitorId: number;
  valueOperator: ApiTrigger.ValueOperatorEnum; //outsideof, within, ==, <, <=, >, >=
  numChannels: number;
  numChannelsOperator: ApiTrigger.NumChannelsOperatorEnum; //any, ==, <, >
  alertOnOutOfAlarm: boolean;
  emailList: string; //comma separated
  val1: number;
  val2?: number;
  lastAlarm?: Alert;
  inAlarm?: boolean;
}
/**
 * Describes a trigger
 */
export class Trigger extends ResourceModel<
  ApiTrigger | ReadOnlyTriggerSerializer | Trigger,
  WriteOnlyTriggerSerializer
> {
  /** @returns formatted number of channels operator */
  get numChannelsString(): string {
    let message = `${NUM_CHANNELS_OPERATORS[this.numChannelsOperator]} `;
    if (this.numChannels !== null && this.numChannels !== undefined) {
      message += `${this.numChannels} `;
    }
    message +=
      this.numChannels && this.numChannels > 1 ? "channels" : "channel";
    return message;
  }

  /** @returns formatted value string */
  get valueString(): string {
    let message = `${VALUE_OPERATORS[this.valueOperator]} ${this.val1}`;
    if (this.val2 !== null && this.val2 !== undefined) {
      message += ` and ${this.val2}`;
    }
    return message;
  }

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Trigger";
  }

  /** @override */
  override fromRaw(
    data: ApiTrigger | ReadOnlyTriggerSerializer | Trigger
  ): void {
    super.fromRaw(data);

    if ("value_operator" in data) {
      Object.assign(this, {
        monitorId: data.monitor,
        valueOperator: data.value_operator, //outsideof, within, ==, <, <=, >, >=
        numChannels: data.num_channels,
        numChannelsOperator: data.num_channels_operator, //any, ==, <, >
        alertOnOutOfAlarm: data.alert_on_out_of_alarm,
        emailList: data.email_list, //comma separated
      });
    }
  }

  /** @override */
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
