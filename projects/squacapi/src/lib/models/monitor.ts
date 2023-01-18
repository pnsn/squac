import { ReadOnlyMonitorDetailSerializer } from "@pnsn/ngx-squacapi-client";
import { Alert, Trigger } from ".";
import { ApiTrigger, ReadMonitor, WriteMonitor } from "../interfaces";

/**
 * describes a monitor
 */
export class Monitor {
  constructor(
    public id: number,
    public name: string | undefined,
    public channelGroupId: number | undefined,
    public metricId: number | undefined,
    public intervalType:
      | ReadOnlyMonitorDetailSerializer.IntervalTypeEnum
      | undefined,
    public intervalCount: number,
    public stat: ReadOnlyMonitorDetailSerializer.StatEnum | undefined,
    public owner: number | undefined,
    public triggers: Trigger[]
  ) {}

  channelGroupName: string;
  metricName: string;
  alerts?: Alert[];
  inAlarm?: boolean;
  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Monitor";
  }

  /**
   *
   * @param item
   */
  static deserialize(item: ReadMonitor): Monitor {
    let triggers: Trigger[] = [];
    if ("triggers" in item && item.triggers) {
      triggers = item.triggers.map((t: ApiTrigger) => Trigger.deserialize(t));
    }

    const monitor = new Monitor(
      item.id ? +item.id : 0,
      item.name,
      item.channel_group,
      item.metric,
      item.interval_type,
      item.interval_count,
      item.stat,
      item.user,
      triggers
    );

    if ("channel_group_name" in item) {
      monitor.channelGroupName = item.channel_group_name;
    }
    if ("metric_name" in item) {
      monitor.metricName = item.metric_name;
    }

    return monitor;
  }

  /**
   *
   */
  serialize(): WriteMonitor {
    return {
      interval_type: this.intervalType,
      interval_count: this.intervalCount,
      channel_group: this.channelGroupId,
      metric: this.metricId,
      stat: this.stat,
      name: this.name,
    };
  }
}
