import { Channel } from "squacapi";

/** Station for map */
export interface MapStation {
  /** station code */
  code: string;
  /** station lat */
  lat: number;
  /** station lon */
  lon: number;
  /** auto included channels */
  autoIncludeChannels: Channel[];
  /** auto excluded channels */
  autoExcludeChannels: Channel[];
  /** selected channels */
  selectedChannels: Channel[];
  /** searched channels */
  searchedChannels: Channel[];
}

/** Map box bounds */
export interface MapBounds {
  /** minimum latitude */
  latMin: number;
  /** maximum latitude */
  latMax: number;
  /** minimum longitude */
  lonMin: number;
  /** maximum longitude */
  lonMax: number;
}
