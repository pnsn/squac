import { Channel, Metric } from "squacapi";
import { WidgetProperties } from "squacapi";

export interface WidgetTypeComponent {
  data: any;
  channels: Channel[];
  selectedMetrics: Metric[];
  properties: WidgetProperties;
  visualMaps: any;
  emphasizedChannel?: string;
  deemphasizedChannel?: string;
  zooming?: string;
  loading?: string | boolean;
  showKey?: boolean;
  ngOnInit(): void;
  resize?(): void;
  updateData?(data: any): void;
  configureChart(): void;
}
