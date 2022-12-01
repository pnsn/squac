import { Channel, Metric, WidgetProperties } from "squacapi";
import { VisualMap } from "./charts.interface";
import { ProcessedData } from "./data.interface";

export interface WidgetTypeComponent {
  data: ProcessedData;
  channels: Channel[];
  selectedMetrics: Metric[];
  properties: WidgetProperties;
  visualMaps: VisualMap;
  emphasizedChannel?: string;
  deemphasizedChannel?: string;
  zooming?: string;
  loading?: string | boolean;
  showKey?: boolean;
  ngOnInit(): void;
  resize?(): void;
  updateData?(data: ProcessedData): void;
  configureChart(): void;
}
