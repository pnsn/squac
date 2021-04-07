import { Injectable } from '@angular/core';
import { Adapter } from './adapter';

// Describes a channel object
export class Channel {
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
    public stationCode: string,
    public networkCode: string
  ) {}

  get nslc(): string {
    return this.networkCode + '.' + this.stationCode + '.' + this.loc + '.' + this.code;
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
}

@Injectable({
  providedIn: 'root',
})
export class ChannelAdapter implements Adapter<Channel> {
  adaptFromApi(item: ApiGetChannel): Channel {
    return new Channel(
      item.id,
      item.code,
      item.name,
      item.sample_rate,
      item.lat,
      item.lon,
      item.elev,
      item.loc,
      item.station_code,
      item.network
    );
  }

  adaptToApi(){}
}
