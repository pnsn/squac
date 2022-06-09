export interface WidgetThresholds {
  type: string; //continuous, piecewise, markLine, markArea,
  dataZoom: string; //dataZoom settings?
  metric: number; //Apply to all or one

  //if continuous or piecewise
  min: number;
  max: number;
  inRange: string; //{color:[]} string;
  outOfRange: string;
  data: Array<string>; //

  //   data: [ // markLine or markArea
  //   { //starting point
  //     name: string //will display as label
  //     yAxis: //value for line
  //   },
  //   { //endint point for markArea
  //     yAxis: //value for line
  //   }
  // ]:
}
