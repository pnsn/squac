interface RowData {
  staCode: string;
  lat: number;
  lon: number;
  metricAgg: number;
  color: string;
}

export interface ChannelRow extends RowData {
  title: string;
  id: number;
  parentId: string;
}

export interface StationRow extends RowData {
  id: string;
  agg: number;
  channelAgg: number;
  count: number;
}
