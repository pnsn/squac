/** row of data for map */
interface RowData {
  /** unique station code */
  staCode: string;
  /** station latitude */
  lat: number;
  /** station longitude */
  lon: number;
  /** count of metrics out of spec for each channel */
  metricAgg: number;
  /** color to represent station with */
  color: string;
  /** count of channel out of spec */
  agg?: number;
}

/** row of channel data for map */
export interface ChannelRow extends RowData {
  /** channel title */
  title: string;
  /** channel id */
  id: number;
  /** channel parent id */
  parentId: string;
}

/** row of station data for map */
export interface StationRow extends RowData {
  /** station id */
  id: string;
  /** aggregate value  */
  agg: number;
  /** count of channels out of spec */
  channelAgg: number;
  /** count of channels*/
  count: number;
}
export type StationChannels = Record<number, string>;
