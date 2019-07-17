import { View } from './view';

export class Dashboard {
  public id: number;
  public name: string;
  public description: string;
  public views: View[];

  constructor(id: number, name: string){
    this.id = id;
    this.name = name;
  }
}
