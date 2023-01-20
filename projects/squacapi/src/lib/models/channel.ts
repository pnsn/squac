import { SquacObject, ReadChannel } from "../interfaces";

/**
 * Describes a channel object
 */
export class Channel implements SquacObject {
  nslc: string;
  constructor(
    public id: number,
    public code: string,
    public name: string,
    public sampleRate: number,
    public lat: number,
    public lon: number,
    public elev: number,
    public loc: string,
    public sta: string,
    public net: string,
    public starttime?: string,
    public endttime?: string,
    _nslc?: string
  ) {
    this.nslc = _nslc ? _nslc : net + "." + sta + "." + loc + "." + code;
  }

  /**
   * @returns station code string
   */
  get staCode(): string {
    return this.net + "." + this.sta;
  }

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Channel";
  }

  /**
   *
   * @param item
   */
  static deserialize(item: ReadChannel): Channel {
    return new Channel(
      item.id ? +item.id : 0,
      item.code.toUpperCase(),
      item.name ?? "",
      item.sample_rate ?? 0,
      item.lat,
      item.lon,
      item.elev,
      item.loc ? item.loc.toUpperCase() : "--",
      item.station_code.toUpperCase(),
      item.network.toUpperCase(),
      item.starttime,
      item.endtime,
      item.nslc?.toUpperCase()
    );
  }
}
