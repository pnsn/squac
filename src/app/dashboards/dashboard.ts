import { Widget } from './widget';

export class Dashboard {
  public id: number;
  public name: string;
  public description: string;
  public widgets: Widget[];

  constructor(id: number, name: string){
    this.id = id;
    this.name = name;
  }
}
