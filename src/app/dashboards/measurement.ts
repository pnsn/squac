export class Measurement {
  constructor(
    public id: number,
    public metricId: number,
    public channelId: number,
    public value: number,
    public starttime: Date,
    public endtime: Date,
  ) {}
}
