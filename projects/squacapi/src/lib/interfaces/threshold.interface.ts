/**
 * Widget threshold
 */
export interface Threshold {
  /** type of threshold, continuous, piecewise etc. */
  type?: string; //continuous, piecewise, markLine, markArea
  /** min value of threshold */
  min: number;
  /** max value of threshold */
  max: number;
  /** metric id */
  metricId: number;
  /** widget display dimension */
  dimension?: string;
  /** in range color options */
  inRange?: {
    color: string[];
    type: string;
  };
  /** out of range color options */
  outOfRange?: {
    color: string[];
    type: string;
  };
  /** widget display type */
  displayType?: string; //worst, channel, stoplight
  /** number of splits for coloring */
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
