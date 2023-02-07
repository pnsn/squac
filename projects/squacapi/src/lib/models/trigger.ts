import { ResourceModel } from "../interfaces";
import {
  Trigger as ApiTrigger,
  WriteOnlyTriggerSerializer,
  ReadOnlyTriggerSerializer,
} from "@pnsn/ngx-squacapi-client";
import { NUM_CHANNELS_OPERATORS, VALUE_OPERATORS } from "../constants";
import { Alert } from "./alert";

export interface Trigger {
  monitorId: number;
  valueOperator: ApiTrigger.ValueOperatorEnum; //outsideof, within, ==, <, <=, >, >=
  numChannels: number;
  numChannelsOperator: ApiTrigger.NumChannelsOperatorEnum; //any, ==, <, >
  alertOnOutOfAlarm: boolean;
  emailList: string; //comma separated
  val1: number;
  val2?: number;
  latestAlert: Alert;
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

  /** @returns string representation of trigger */
  get fullString(): string {
    return `${this.numChannelsString} ${this.valueString}`;
  }

  /** @returns true if most recent alert is in alarm */
  get inAlarm(): boolean | undefined {
    return this.latestAlert ? this.latestAlert.inAlarm : undefined;
  }

  /** @returns time stamp of most recent alert */
  get lastUpdate(): string | undefined {
    return this.latestAlert ? this.latestAlert.timestamp : undefined;
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

    if ("latest_alert" in data) {
      this.latestAlert = new Alert(data.latest_alert);
    }
    if ("monitor" in data) {
      this.monitorId = data.monitor;
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
