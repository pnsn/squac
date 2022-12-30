import { ArchiveStatType, ArchiveType } from "../types";

/** Dashboard properties */
export interface DashboardProperties {
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
