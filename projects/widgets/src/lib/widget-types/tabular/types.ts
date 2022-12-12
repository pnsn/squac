interface RowData {
  agg: number;
  title: string;
  id: string | number;
  treeStatus?: "disabled" | "collapsed" | "loading" | "expanded";
  parentId?: string | null;
}

export interface ChannelRow extends RowData {
  id: number;
  nslc: string;
  parentId: string;
}

export interface StationRow extends RowData {
  id: string;
  count: number;
  type: string;
  parentId?: null;
}

export interface RowMetric {
  value: number;
  color: string;
  count: number;
}

export type RowMetrics = Record<number, RowMetric>;
