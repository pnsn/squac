import { Injectable } from '@angular/core';
import { Adapter } from '@core/models/adapter';
import { Channel } from '@core/models/channel';
import { ApiGetChannelGroup, ChannelGroup, ChannelGroupAdapter } from '@core/models/channel-group';
import { Metric, ApiGetMetric, MetricAdapter } from '@core/models/metric';
import { ApiGetTrigger, Trigger, TriggerAdapter } from './trigger';

export class Monitor {
  constructor(
    public id: number,
    public name: string,
    public channelGroupId: number,
    public metricId: number,
    public intervalType: string,
    public intervalCount: number,
    public numberChannels: number,
    public stat: string,
    public owner: number,
    public triggers: Trigger[]
  ) {}

  channelGroup : ChannelGroup;
  metric: Metric;
}

export interface ApiGetMonitor {
  id: number;
  url: string;
  channel_group?: number | ApiGetChannelGroup;
  metric?: number | ApiGetMetric;
  interval_type: string;
  interval_count?: number;
  num_channels?: number;
  stat: string;
  name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  triggers?: Array<ApiGetTrigger>
}

@Injectable({
  providedIn: "root",
})
export class MonitorAdapter implements Adapter<Monitor> {
  //channelgroup adapter,metric adapter
  constructor(
    private metricAdapter: MetricAdapter,
    private channelGroupAdapter: ChannelGroupAdapter,
    private triggerAdapter: TriggerAdapter
  ) {}
  adapt(item: ApiGetMonitor): Monitor {
    let channelGroupId;
    let metricId;
    let channelGroup: ChannelGroup;
    let metric: Metric;
    let triggers: Trigger[];
    //sometimes API returns number, sometimes group
    if(typeof item.channel_group === "number") {
      channelGroupId = item.channel_group;
    } else {
      channelGroupId = item.channel_group.id;
      channelGroup = this.channelGroupAdapter.adapt(item.channel_group);
    }

    if(typeof item.metric === "number") {
      metricId = item.metric;
    } else {
      metricId = item.metric.id;
      metric = this.metricAdapter.adapt(item.metric);
    }

    if(item.triggers) {
      triggers = item.triggers.map(t => this.triggerAdapter.adapt(t));
    }

    let monitor = new Monitor(
      item.id,
      item.name,
      channelGroupId,
      metricId,
      item.interval_type,
      item.interval_count,
      item.num_channels,
      item.stat,
      +item.user_id,
      triggers
    );

    monitor.channelGroup = channelGroup;
    monitor.metric = metric;

    return monitor;
  }
}
