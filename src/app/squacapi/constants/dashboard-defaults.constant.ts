import { ArchiveType } from "../enums";
import { DashboardProperties } from "../interfaces";

export const DASHBOARD_PROPERTIES: DashboardProperties = {
  timeRange: 3600,
  archiveType: ArchiveType.RAW,
  autoRefresh: true,
};
