import { Injectable } from "@angular/core";
import { ReadOnlyMonitorDetailSerializer } from "@pnsn/ngx-squacapi-client";
import { Alert, Trigger, TriggerAdapter } from ".";
import { Adapter, ApiTrigger, ReadMonitor, WriteMonitor } from "../interfaces";

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
}

/**
 * adapts monitor
 */
@Injectable({
  providedIn: "root",
})
export class MonitorAdapter
  implements Adapter<Monitor, ReadMonitor, WriteMonitor>
{
  /**
   * @override
   */
  adaptFromApi(item: ReadMonitor): Monitor {
    const triggerAdapter = new TriggerAdapter();
    let triggers: Trigger[] = [];
    if ("triggers" in item && item.triggers) {
      triggers = item.triggers.map((t: ApiTrigger) =>
        triggerAdapter.adaptFromApi(t)
      );
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
   * @override
   */
  adaptToApi(item: Monitor): WriteMonitor {
    return {
      interval_type: item.intervalType,
      interval_count: item.intervalCount,
      channel_group: item.channelGroupId,
      metric: item.metricId,
      stat: item.stat,
      name: item.name,
    };
  }
}
