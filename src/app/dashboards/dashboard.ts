import { Widget } from './widget';

export class Dashboard {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public widgets: Widget[]
  ){
  }
}
