import { Channel } from "@squacapi/models/channel";
import { Metric } from "@squacapi/models/metric";
import { Threshold } from "@squacapi/models/threshold";

export interface WidgetTypeComponent {
  data: any;
  metrics: Metric[];
  channels: Channel[];
  thresholds?: { [metricId: number]: Threshold };
  selectedMetric?: Metric;
}
