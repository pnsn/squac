import { Channel, MeasurementTypes, Metric, WidgetProperties } from "squacapi";
import { VisualMap } from "./charts.interface";

/** Describes a widget component */
export interface WidgetTypeComponent {
  /** widget data */
  data: MeasurementTypes[];
  /** channels used on widget */
  channels: Channel[];
  /** metrics used on widget */
  selectedMetrics: Metric[];
  /** widget properties */
  properties: WidgetProperties;
  /** visual maps of metrics and thresholds */
  visualMaps: VisualMap;
  /** NSLC of emphasized channel */
  emphasizedChannel?: string;
  /** NSLC of deemphasized channel */
  deemphasizedChannel?: string;
  /** status of zooming */
  zooming?: string;
  /** loading status */
  loading?: string | boolean;
  /** status of key toggle */
  showKey?: boolean;
  /** on init function */
  ngOnInit(): void;
  /** resize function */
  resize?(): void;
  /** update data function */
  updateData?(data: MeasurementTypes[]): void;
  /** configure chart data */
  configureChart(): void;
  /** config to use denser styling */
  denseView: boolean;
}
