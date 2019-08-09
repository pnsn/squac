export class ChannelGroup {
  public id: number;
  public name: string;
  public description: string;
  public channels : string[];

  constructor(id: number, name: string, description: string, channels?:string[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.channels = channels;
  }

}