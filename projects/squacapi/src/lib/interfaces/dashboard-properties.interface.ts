import { ArchiveStatType, ArchiveType } from "../types";

export interface DashboardDisplayProperties {
  /** don't show channels without data */
  hideChannelsWithoutData?: boolean;
  /** disable default chart linking */
  linkCharts?: boolean;
  /** use dense view that hides controls */
  denseView?: boolean;
}

/** Dashboard properties */
export interface DashboardProperties extends DashboardDisplayProperties {
  /** Time range of dashboard in seconds */
  timeRange?: number;
  /** Start time of dashboard */
  startTime?: string;
  /** end time of dashboard */
  endTime?: string;
  /** archive statistic */
  archiveStat?: ArchiveStatType;
  /** archive data type */
  archiveType: ArchiveType;
  /** true if dashboard should refresh data automatically */
  autoRefresh: boolean;
}
