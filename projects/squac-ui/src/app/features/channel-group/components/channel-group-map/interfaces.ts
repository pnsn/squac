import { Channel } from "squacapi";

export interface MapStation {
  code: string;
  lat: number;
  lon: number;
  autoIncludeChannels: Channel[];
  autoExcludeChannels: Channel[];
  selectedChannels: Channel[];
  searchedChannels: Channel[];
}
