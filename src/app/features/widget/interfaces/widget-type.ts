/**
 * Info that describes a widget type
 */
export interface WidgetType {
  name: string;
  type: string;
  description: string;
  displayInfo: string;
  zoomControls?: boolean;
  useAggregate?: boolean;
  toggleKey?: boolean;
  minMetrics: number;
  defaultDisplay?: string;
  displayOptions?: { [type: string]: WidgetDisplayOption };
}

export interface WidgetDisplayOption {
  dimensions: string[];
  description: string;
  name?: string;
}