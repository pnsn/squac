import { Channel } from './channel';

export class ChannelGroup {
  constructor(
    public id: number,
    public name: string,
    public description: string, 
    public channels?:Channel[]
  ) {
  }

}