export class Threshold {
  type: string; //continuous, piecewise, markLine, markArea
  min: number;
  max: number;
  inRange: {
    color: string[];
  };
  outOfRange: {
    color: string[];
  };
  metrics: [];
  data: [];
  reverseColors: boolean;
  numSplits: number;
  constructor() {}
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
