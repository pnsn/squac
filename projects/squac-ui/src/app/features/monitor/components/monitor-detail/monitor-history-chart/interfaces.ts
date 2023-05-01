/** descrives channel data used on chart */
export interface ChannelData {
  /** Alert id */
  alert: number;
  /** channel id */
  channel: number;
  /** channel value */
  value: number;
  /** alert start time */
  starttime: string;
  /** alert end time */
  endtime: string;
}
