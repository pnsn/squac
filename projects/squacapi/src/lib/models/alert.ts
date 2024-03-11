import { ReadOnlyResourceModel } from "../interfaces";
import {
  Trigger as ApiTrigger,
  ReadOnlyAlertDetailSerializer,
} from "@pnsn/ngx-squacapi-client";

/** Describes a breaching channel */
export interface BreachingChannel {
  /** channel nscl */
  channel: string;
  /** id of channel */
  channel_id: number;
  /** minimum value in time range, if min stat for monitor is chosen */
  min?: number;
  /** maximum value in time range, if max stat for monitor is chosen */
  max?: number;
  /** number of measurements, if count stat for monitor is chosen */
  count?: number;
  /** sum of measurements, if sum stat for monitor is chosen */
  sum?: number;
  /** average value of measurements, if avg stat is chosen */
  avg?: number;
}

/** Describes an alert */
export interface Alert {
  /** time alert was issued */
  timestamp: string;
  /** true if alert is in alarm state */
  inAlarm: boolean;
  /** channels breaching during time window */
  breachingChannels: BreachingChannel[];
  /** id of trigger for this alert */
  triggerId: number;
  /** id of monitor for this alert */
  monitorId: number;
  /** name of monitor */
  monitorName: string;
  /** monitor low value */
  val1: number;
  /** monitor high value */
  val2?: number;
  /** monitor value operator */
  valueOperator: ApiTrigger.ValueOperatorEnum;
  /** monitor number of channels */
  numChannels: number;
  /** monitor number of channels operator */
  numChannelsOperator: ApiTrigger.NumChannelsOperatorEnum;
}

/**
 * Alert class for interacting with squacapi alerts
 */
export class Alert extends ReadOnlyResourceModel<
  ReadOnlyAlertDetailSerializer | Alert
> {
  /** @returns model name */
  static get modelName(): string {
    return "Alert";
  }

  /** Timestamps should not show decimal seconds */
  formatTimeStamp(): void {
    if (this.timestamp) {
      const timestr = this.timestamp.split(".");
      this.timestamp = timestr[0] + "Z";
    }
  }

  /** @override */
  override fromRaw(data: ReadOnlyAlertDetailSerializer | Alert): void {
    super.fromRaw(data);

    if ("breaching_channels" in data) {
      let breachingChannels: BreachingChannel[] = [];
      this.triggerId = data.trigger;
      this.monitorId = +data.monitor;
      if (typeof data.breaching_channels === "string") {
        try {
          breachingChannels = JSON.parse(
            data.breaching_channels
          ) as BreachingChannel[];
        } catch (e) {
          breachingChannels = [];
        }
      }
      this.breachingChannels = breachingChannels;
    }
    this.formatTimeStamp();
  }
}
