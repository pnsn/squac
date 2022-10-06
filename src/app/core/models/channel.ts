import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";
import { ReadChannel } from "./squac-types";
// Describes a channel object

export class Channel {
  nslc: string;
  constructor(
    public id: number,
    public code: string,
    public name: string,
    public sampleRate: number,

    // from loc
    public lat: number,
    public lon: number,
    public elev: number,
    public loc: string,
    public sta: string,
    public net: string,
    public starttime: string,
    public endttime: string,
    _nslc: string
  ) {
    this.nslc = _nslc ? _nslc : net + "." + sta + "." + loc + "." + code;
  }

  get staCode(): string {
    return this.net + "." + this.sta;
  }

  static get modelName() {
    return "Channel";
  }
}
@Injectable({
  providedIn: "root",
})
export class ChannelAdapter implements Adapter<Channel> {
  adaptFromApi(item: ReadChannel): Channel {
    return new Channel(
      item.id,
      item.code?.toUpperCase(),
      item.name,
      item.sample_rate,
      item.lat,
      item.lon,
      item.elev,
      item.loc?.toUpperCase(),
      item.station_code?.toUpperCase(),
      item.network?.toUpperCase(),
      item.starttime,
      item.endtime,
      item.nslc?.toUpperCase()
    );
  }
}
