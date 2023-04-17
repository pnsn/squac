import {
  ReadOnlyMonitorDetailSerializer,
  ReadOnlyMonitorSerializer,
  WriteOnlyMonitorSerializer,
  Trigger as ApiTrigger,
} from "@pnsn/ngx-squacapi-client";
import { Trigger } from "../models";
import { ResourceModel } from "../interfaces";
import { IntervalType, MonitorStatType } from "../types";

export interface Monitor {
  name: string;
  channelGroupId: number;
  metricId: number;
  intervalType: IntervalType;
  intervalCount: number;
  stat: MonitorStatType;
  triggers: Trigger[];
  channelGroupName: string;
  metricName: string;
  doDailyDigest: boolean;
}
/**
 * describes a monitor
 */
export class Monitor extends ResourceModel<
  ReadOnlyMonitorDetailSerializer | ReadOnlyMonitorSerializer | Monitor,
  WriteOnlyMonitorSerializer
> {
  // triggers sorted by last alert, descending
  private _sortedTriggers: Trigger[];
  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Monitor";
  }

  /**
   * @returns true if any trigger is in alarm
   */
  get inAlarm(): boolean | undefined {
    return this.triggers.length > 0
      ? this.triggers.some((t) => t.inAlarm)
      : undefined;
  }

  /** @returns date monitor last went into alarm or last state change */
  get lastUpdate(): string | undefined {
    const trigger =
      this._sortedTriggers.find((t) => t.inAlarm) ?? this._sortedTriggers[0];
    return trigger?.lastUpdate;
  }

  /** @override */
  override fromRaw(
    data: ReadOnlyMonitorDetailSerializer | ReadOnlyMonitorSerializer | Monitor
  ): void {
    super.fromRaw(data);

    if ("triggers" in data && data.triggers) {
      this.triggers = data.triggers.map(
        (t: ApiTrigger | Trigger) => new Trigger(t)
      );
      this._sortedTriggers = this.triggers?.sort((t1: Trigger, t2: Trigger) => {
        return (
          new Date(t2.lastUpdate).valueOf() - new Date(t1.lastUpdate).valueOf()
        );
      });
    }
    if ("channel_group" in data) {
      this.channelGroupId = data.channel_group;
      this.metricId = data.metric;
    }
  }

  /** @override */
  toJson(): WriteOnlyMonitorSerializer {
    return {
      interval_type: this.intervalType,
      interval_count: this.intervalCount,
      channel_group: this.channelGroupId,
      metric: this.metricId,
      stat: this.stat,
      name: this.name,
      do_daily_digest: this.doDailyDigest,
    };
  }
}
