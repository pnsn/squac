import { WidgetType } from "../constants";
import { WidgetDisplayOption } from "./widget-display-option.interface";

/**
 * Info that describes a widget type
 */
export interface WidgetConfig {
  /** widget display name */
  name: string;
  /** widget type */
  type: WidgetType;
  /** description */
  description: string;
  /** display info text */
  displayInfo: string;
  /** enable zoom controls? */
  zoomControls?: boolean;
  /** use aggregate data? */
  useAggregate?: boolean;
  /** enable legend or key toggle? */
  toggleKey?: boolean;
  /** minimum required metrics */
  minMetrics: number;
  /** default display option */
  defaultDisplay?: string;
  /** widget display options */
  displayOptions?: Record<string, WidgetDisplayOption>;
}
