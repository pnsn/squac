import { EventEmitter } from "@angular/core";
import { Channel } from "@squacapi/models/channel";
import { Metric } from "@squacapi/models/metric";
import { Threshold } from "@squacapi/models/threshold";

export interface WidgetTypeComponent {
  data: any;
  channels: Channel[];
  selectedMetrics: Metric[];
  properties: any;

  zooming?: string;
  zoomingChange?: EventEmitter<string>;
  loading?: string | boolean;
  loadingChange?: EventEmitter<string | boolean>;
  showKey?: boolean;
  resize?(): void;

  updateData?(data: any): void;
}
