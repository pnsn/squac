import { Trigger } from './trigger';

export class Monitor {
  constructor(
    public id: number,
    public name: string,
    public channelGroupId: number,
    public metricId: number,
    public intervalType: string,
    public intervalCount: number,
    public numberChannels: number,
    public stat: string,
    public owner: number,
    public triggers: Trigger[]
  ) {}

}
