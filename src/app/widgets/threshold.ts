export class Threshold {

  constructor(
    public id: number,
    public owner: number,
    public widgetId: number,
    public metricId: number,
    public min: number,
    public max: number
  ) {

  }

  static get modelName() {
    return 'Threshold';
  }
}
