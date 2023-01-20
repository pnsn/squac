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
      item.channelGroup,
      item.metric,
      item.intervalType,
      item.intervalCount,
      item.stat,
      item.user,
      triggers
    );

    if ("channelGroupName" in item) {
      monitor.channelGroupName = item.channelGroupName;
    }
    if ("metricName" in item) {
      monitor.metricName = item.metricName;
    }

    return monitor;
  }

  /**
   *
   */
  serialize(): WriteMonitor {
    return {
      intervalType: this.intervalType,
      intervalCount: this.intervalCount,
      channelGroup: this.channelGroupId,
      metric: this.metricId,
      stat: this.stat,
      name: this.name,
    };
  }
}
