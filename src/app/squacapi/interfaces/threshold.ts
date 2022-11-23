export interface Threshold {
  type?: string; //continuous, piecewise, markLine, markArea
  min: number;
  max: number;
  metricId: number;
  dimension?: any;
  inRange?: {
    color: string[];
    type: string;
  };
  outOfRange?: {
    color: string[];
    type: string;
  };
  displayType?: string; //worst, channel, stoplight
  numSplits?: number;

  // returns true if in threshold, false if outside or no thresholds
  // checkThresholds(value: number): boolean {
  //   let withinThresholds = true;
  //   if (this.max !== null && value !== null && value > this.max) {
  //     withinThresholds = false;
  //   }
  //   if (this.min !== null && value !== null && value < this.min) {
  //     withinThresholds = false;
  //   }

  //   // TODO: is no thresholds in or out
  //   if (this.min === null && this.max === null) {
  //     withinThresholds = false;
  //   }
  //   return withinThresholds;
  // }
}

//can only have one if not metric
// {
//   type: string //continuous, piecewise, markLine, markArea
//   dataZoom: []
//   metric?: number //if no metric, show for all and limit to one threshold

//   //continuous & piecewise
//   min:
//   max:
//   inRange: {color:[]}
//   outOfRange: {color:[]}

//   //markLine and markArea
//   data: [ // markLine or markArea
//     { //starting point
//       name: string //will display as label
//       yAxis: //value for line
//     },
//     { //endint point for markArea
//       yAxis: //value for line
//     }
//   ]:
// }
