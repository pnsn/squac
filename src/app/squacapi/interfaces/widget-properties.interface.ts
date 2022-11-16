export interface WidgetProperties {
  //depends on which widgetType
  dimensions?: any; //order of display
  inRange?: {
    color: string[];
    type: string;
  };
  outOfRange?: {
    color: string[];
    type: string;
  };
  reverseColors?: boolean;
  displayType?: string; //worst, channel, stoplight
  numSplits?: number;
  // show_legend: boolean; TODO: add these
  // show_tooltips: boolean;
  // zoom: boolean;
  // sampling: string;
}
