import { Injectable } from "@angular/core";
import { ReadOnlyMonitorDetailSerializer } from "@pnsn/ngx-squacapi-client";
import {
  // ApiGetChannelGroup,
  ChannelGroup,
  ChannelGroupAdapter,
  Metric,
  MetricAdapter,
  Alert,
  Trigger,
  TriggerAdapter,
} from "../models";
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

  channelGroup?: ChannelGroup;
  metric?: Metric;
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
    const channelGroupAdapter = new ChannelGroupAdapter();
    const metricAdapter = new MetricAdapter();
    const triggerAdapter = new TriggerAdapter();
    let channelGroupId;
    let metricId;
    let channelGroup: ChannelGroup;
    let metric: Metric;
    let triggers: Trigger[] = [];
    // sometimes API returns number, sometimes group
    if (typeof item.channel_group === "number") {
      channelGroupId = item.channel_group;
    } else if (item.channel_group) {
      channelGroupId = item.channel_group.id;
      channelGroup = channelGroupAdapter.adaptFromApi(item.channel_group);
    }

    if (typeof item.metric === "number") {
      metricId = item.metric;
    } else if (item.metric) {
      metricId = item.metric.id;
      metric = metricAdapter.adaptFromApi(item.metric);
    }

    if ("triggers" in item && item.triggers) {
      triggers = item.triggers.map((t: ApiTrigger) =>
        triggerAdapter.adaptFromApi(t)
      );
    }

    const monitor = new Monitor(
      item.id ? +item.id : 0,
      item.name,
      channelGroupId,
      metricId,
      item.interval_type,
      item.interval_count,
      item.stat,
      item.user,
      triggers
    );

    monitor.channelGroup = channelGroup;
    monitor.metric = metric;

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
