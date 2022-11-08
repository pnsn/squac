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
  displayOptions?: WidgetDisplayOption[];
}

export interface WidgetDisplayOption {
  displayType: string;
  dimensions: string[];
  description: string;
}
