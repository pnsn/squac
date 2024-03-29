import { BaseModel } from "../interfaces";
import {
  Aggregate,
  Alert,
  Archive,
  Channel,
  ChannelGroup,
  Dashboard,
  MatchingRule,
  Measurement,
  Metric,
  Monitor,
  Network,
  Organization,
  Trigger,
  User,
  Widget,
} from "../models";

/**
 * Available squacapi end points.
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

/** Invite api endpoints */
export enum InviteApiEndpoint {
  INVITE = "invite",
  REGISTER = "register",
}

/** Map api endpoints to squac-ui classes */
export const ApiEndpointToClass: { [key in ApiEndpoint]?: any } = {
  [ApiEndpoint.AGGREGATE]: Aggregate,
  [ApiEndpoint.ALERT]: Alert,
  [ApiEndpoint.USER_ME]: User,
  [ApiEndpoint.DAY_ARCHIVE]: Archive,
  [ApiEndpoint.HOUR_ARCHIVE]: Archive,
  [ApiEndpoint.WEEK_ARCHIVE]: Archive,
  [ApiEndpoint.MONTH_ARCHIVE]: Archive,
  [ApiEndpoint.CHANNEL_GROUP]: ChannelGroup,
  [ApiEndpoint.CHANNEL]: Channel,
  [ApiEndpoint.DASHBOARD]: Dashboard,
  [ApiEndpoint.MATCHING_RULE]: MatchingRule,
  [ApiEndpoint.MEASUREMENT]: Measurement,
  [ApiEndpoint.METRIC]: Metric,
  [ApiEndpoint.MONITOR]: Monitor,
  [ApiEndpoint.NETWORK]: Network,
  [ApiEndpoint.ORGANIZATION]: Organization,
  [ApiEndpoint.ORGANIZATION_USER]: User,
  [ApiEndpoint.TRIGGER]: Trigger,
  [ApiEndpoint.WIDGET]: Widget,
};

/**
 * Returns class from given endpoint
 *
 * @param endpoint api endpoint to search for
 * @returns object class
 */
export function getKlass<T extends BaseModel>(endpoint: ApiEndpoint): T {
  return ApiEndpointToClass[endpoint] as T;
}
