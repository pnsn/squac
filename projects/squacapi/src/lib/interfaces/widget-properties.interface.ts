/**
 * Widget display properties that are stored in squacapi
 */
export interface WidgetProperties {
  /** dimensions for metrics (varies by widget type) */
  dimensions?: any; //order of display
  /** in range colors */
  inRange?: Color;
  /** out of range colors */
  outOfRange?: Color;
  /** true if colors should be reversed */
  reverseColors?: boolean;
  /** display type (varies by widget type) */
  displayType?: string; //worst, channel, stoplight
  /** number of splits for coloring */
  numSplits?: number;
  // show_legend: boolean; TODO: add these
  // show_tooltips: boolean;
  // zoom: boolean;
  // sampling: string;
}

/** Color configuration */
export interface Color {
  /** Array of color strings */
  color: string[];
  /** name of color type */
  type: string;
  /** opacity value */
  opacity?: number;
}
