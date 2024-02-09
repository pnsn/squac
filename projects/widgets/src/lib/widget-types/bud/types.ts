/** Helper types for bud componenet */

/** Single Data for a Channel */
export interface ChannelData {
  /** Channel Code */
  chan: string;
  /** Aggregated measurement value */
  value: number;
}

/** Stations with child channel data  */
export interface StationData {
  /** Station code */
  name: string;
  /** Stations's network code */
  network: string;
  /** Data for station's channels */
  channelData: ChannelData[];
}
