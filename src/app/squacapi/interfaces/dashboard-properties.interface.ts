import { ArchiveStatType, ArchiveType } from "../enums";

export interface DashboardProperties {
  timeRange?: number;
  startTime?: string;
  endTime?: string;
  archiveStat?: ArchiveStatType;
  archiveType: ArchiveType;
  autoRefresh: boolean;
}
