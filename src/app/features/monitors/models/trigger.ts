export class Trigger {
  constructor(
    public id: number,
    public monitorId: number,
    public bandInclusive: boolean,
    public level: number,
    public owner: number,
    public min?: number,
    public max?: number
  ) {}

}
