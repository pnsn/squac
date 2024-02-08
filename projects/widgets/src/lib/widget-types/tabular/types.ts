/** metric data for each row */
export interface RowMetric {
  /** value for metric */
  value: number;
  /** color for metric */
  color: string;
  /** number of channels out of spec for metric */
  count?: number;
  /** is the metric in spec */
  inSpec: boolean;
  /** metric id */
  id?: number;
}

/** record of metric id to row metric data */
export type RowMetrics = Record<string, RowMetric>;

export interface Row {
  /** display title, will be nslc or ns */
  title: string;
  /** count of out of spec metrics or channels */
  agg: number;
  /** metric data for row */
  metrics?: RowMetrics;
  /** child rows to show on expand */
  children?: Row[];
  /** on a station, the worst channel's agg */
  channelAgg?: number;
  /** identifier if row is nested */
  parentId?: string;
  /** row identifier */
  id?: string;
}
