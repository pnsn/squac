import { LocalStorageTypes } from "@core/services/local-storage.service";

export enum ApiMethod {
  LIST = "List",
  READ = "Read",
  UPDATE = "Update",
  CREATE = "Create",
  DELETE = "Delete",
  PARTIAL_UPDATE = "PartialUpdate",
}
/**
 * Api endpoints maped to models.
 */
export enum ApiEndpoints {
  AGGREGATE = "measurementAggregated",
  ALERT = "measurementAlerts",
  USER_ME = "userMe",
  USER_TOKEN = "userToken",
  DAY_ARCHIVE = "measurementDayArchives",
  HOUR_ARCHIVE = "measurementHourArchives",
  WEEK_ARCHIVE = "measurementWeekArchives",
  MONTH_ARCHIVE = "measurementMonthArchives",
  CHANNEL_GROUP = "nslcGroups",
  CHANNEL = "nslcChannels",
  DASHBOARD = "dashboardDashboards",
  MATCHING_RULE = "nslcMatchingRules",
  MEASUREMENT = "measurementMeasurements",
  METRIC = "measurementMetrics",
  MONITOR = "measurementMonitors",
  NETWORK = "measurementNetworks",
  ORGANIZATION = "organizationOrganizations",
  ORGANIZATION_USER = "organizationUsers",
  TRIGGER = "measurementTriggers",
  WIDGET = "dashboardWidgets",
}

export enum InviteApiEndpoints {
  INVITE = "invite",
  REGISTER = "register",
}

export const CachableRoutePatterns = {
  "/dashboard/dashboards/": LocalStorageTypes.SESSION,
  "/dashboard/dashboards/:id/": LocalStorageTypes.SESSION,
  "/measurement/metrics/": LocalStorageTypes.SESSION,
  "/measurement/metrics/:id/": LocalStorageTypes.SESSION,
  "/measurement/measurements/": LocalStorageTypes.SESSION,
  "/organization/organizations": LocalStorageTypes.SESSION,
  "/nslc/groups/": LocalStorageTypes.SESSION,
  "/nslc/groups/:id/": LocalStorageTypes.SESSION,
};
