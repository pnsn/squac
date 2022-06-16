import { Channel } from "@core/models/channel";
import { Metric } from "@core/models/metric";
import { Threshold } from "@features/widget/models/threshold";

export interface WidgetTypeComponent {
  data: any;
  metrics: Metric[];
  channels: Channel[];
  thresholds?: { [metricId: number]: Threshold };
  selectedMetric?: Metric;
  resize(): void;
}
