export class Threshold {
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
  static get modelName() {
    return "Threshold";
  }
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
