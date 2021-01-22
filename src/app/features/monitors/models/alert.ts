export class Alert {
  constructor(
    public id: number,
    public owner: number,
    public triggerId: number,
    public timestamp: string,
    public message: string,
    public inMonitor: boolean
  ){
  }

}

