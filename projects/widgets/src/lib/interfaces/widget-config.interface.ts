import { WidgetDisplayOption } from ".";

/**
 * Info that describes a widget type
 */
export interface WidgetConfig {
  name: string;
  type: string;
  description: string;
  displayInfo: string;
  zoomControls?: boolean;
  useAggregate?: boolean;
  toggleKey?: boolean;
  minMetrics: number;
  defaultDisplay?: string;
  displayOptions?: Record<string, WidgetDisplayOption>;
}
