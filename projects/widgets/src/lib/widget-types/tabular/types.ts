/** represents row of data in table */
interface RowData {
  /** aggregate value of row */
  agg: number;
  /** display title */
  title: string;
  /** identifier of row */
  id: string | number;
  /** tree collapse status */
  treeStatus?: "disabled" | "collapsed" | "loading" | "expanded";
  /** id of parent, if child row */
  parentId?: string | null;
}

/** row of data in table that is a single channel */
export interface ChannelRow extends RowData {
  /** channel id */
  id: number;
  /** channel nslc */
  nslc: string;
  /** channel's station id */
  parentId: string;
}

/** row of data in table for a station */
export interface StationRow extends RowData {
  /** station id */
  id: string;
  /** count of child channels */
  count: number;
  /** type of display */
  type: string;
  /** parent id, always null */
  parentId?: null;
}

/** metric data for each row */
export interface RowMetric {
  /** value for metric */
  value: number;
  /** color for metric */
  color: string;
  /** number of channels for metric */
  count: number;
}

/** record of metric id to row metric data */
export type RowMetrics = Record<number, RowMetric>;
