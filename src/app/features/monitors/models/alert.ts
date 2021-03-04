import { Trigger } from "./trigger";

export class Alert {
  constructor(
    public id: number,
    public owner: number,
    public timestamp: string,
    public message: string,
    public inAlarm: boolean,
    public trigger: Trigger
  ){
  }

}

