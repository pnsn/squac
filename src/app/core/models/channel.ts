import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";

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

export interface ApiGetChannel {
  id: number;
  class_name: string;
  code: string;
  name: string;
  station_code: string;
  station_name: string;
  url: string;
  description: string;
  sample_rate: number;
  network: string;
  loc: string;
  lat: number;
  lon: number;
  elev: number;
  azimuth: number;
  dip: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  starttime: string;
  endtime: string;
  nslc: string;
}

@Injectable({
  providedIn: "root",
})
export class ChannelAdapter implements Adapter<Channel> {
  adaptFromApi(item: ApiGetChannel): Channel {
    console.log(item);
    return new Channel(
      item.id,
      item.code.toUpperCase(),
      item.name,
      item.sample_rate,
      item.lat,
      item.lon,
      item.elev,
      item.loc.toUpperCase(),
      item.station_code.toUpperCase(),
      item.network.toUpperCase(),
      item.starttime,
      item.endtime,
      item.nslc.toUpperCase()
    );
  }
}
