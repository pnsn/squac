export interface PageInfo {
  offset: number;
  pageSize: number;
  limit: number;
  count: number;
}

export interface PagedData {
  count: number;
  next: string;
  previous: string;
  results: any[];
}
