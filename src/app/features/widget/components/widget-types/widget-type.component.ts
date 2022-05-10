import { Channel } from "@core/models/channel";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "@features/widget/models/threshold";

export interface WidgetTypeComponent {
  data: any;
  metrics: Metric[];
  channelGroup: ChannelGroup;
  channels: Channel[];
  thresholds?: { [metricId: number]: Threshold };
  selectedMetric?: Metric;
}
