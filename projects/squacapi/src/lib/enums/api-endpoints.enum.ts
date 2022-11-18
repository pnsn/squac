/**
 * Api endpoints maped to models.
 */
export enum ApiEndpoint {
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

export enum InviteApiEndpoint {
  INVITE = "invite",
  REGISTER = "register",
}
