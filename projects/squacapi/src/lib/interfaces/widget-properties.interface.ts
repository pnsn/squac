export interface WidgetProperties {
  //depends on which widgetType
  dimensions?: any; //order of display
  inRange?: Color;
  outOfRange?: Color;
  reverseColors?: boolean;
  displayType?: string; //worst, channel, stoplight
  numSplits?: number;
  // show_legend: boolean; TODO: add these
  // show_tooltips: boolean;
  // zoom: boolean;
  // sampling: string;
}

export interface Color {
  color: string[];
  type: string;
  opacity?: number;
}
