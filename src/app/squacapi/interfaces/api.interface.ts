import { LocalStorageTypes } from "@core/services/local-storage.service";
import {
  Aggregate,
  AggregateListParams,
  ReadAggregate,
} from "@squacapi/models/aggregate";
import { Archive } from "@squacapi/models/archive";
import { Channel } from "@squacapi/models/channel";
import { ChannelGroup } from "@squacapi/models/channel-group";
import { Dashboard } from "@squacapi/models/dashboard";
import { MatchingRule } from "@squacapi/models/matching-rule";
import { Measurement } from "@squacapi/models/measurement";
import { Metric } from "@squacapi/models/metric";
import { Monitor } from "@squacapi/models/monitor";
import { Network } from "@squacapi/models/network";
import { Organization } from "@squacapi/models/organization";
import { Trigger } from "@squacapi/models/trigger";
import { User } from "@squacapi/models/user";
import { Widget } from "@squacapi/models/widget";
import { Observable } from "rxjs";

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

export type ApiConfig = {
  class: any; // object class
  methods: {
    [key in ApiMethod]?: Array<any>; //map of available Api Methods and required Params
  };
  cache?: LocalStorageTypes; //should requests for this type be cache
};

/**
 * This maps top level api request routes to a class & allowed. For example, if a request is
 * made to "/api/person" which returns an array of people, we want each item in that
 * array to be an instance of User. Like wise a request to "/api/person/<id>" returns
 * a single person, we also want that to be an instance of User.
 */
export const ApiRouteToData = {
  [ApiEndpoints.AGGREGATE]: {
    class: Aggregate,
    methods: {
      [ApiMethod.LIST]: [AggregateListParams, Observable<ReadAggregate>],
    },
  },
  [ApiEndpoints.USER_ME]: {
    class: User,
    app: User,
    model: "Me",
    methods: {
      [ApiMethod.READ]: [],
      [ApiMethod.PARTIAL_UPDATE]: [],
    },
  },
  [ApiEndpoints.USER_TOKEN]: {
    class: undefined,
    app: "User",
    model: "Token",
    methods: { [ApiMethod.CREATE]: [] },
  },
  [ApiEndpoints.DAY_ARCHIVE]: {
    class: Archive,
    app: "Measurement",
    model: "DayArchives",
    methods: { [ApiMethod.LIST]: [] },
  },
  [ApiEndpoints.HOUR_ARCHIVE]: {
    class: Archive,
    app: "Measurement",
    model: "HourArchives",
    methods: { [ApiMethod.LIST]: [] },
  },
  [ApiEndpoints.WEEK_ARCHIVE]: {
    class: Archive,
    methods: [ApiMethod.LIST],
    endpoint: "measurementWeekArchives",
  },
  [ApiEndpoints.MONTH_ARCHIVE]: {
    class: Archive,
    methods: [ApiMethod.LIST],
    endpoint: "measurementMonthArchives",
  },
  [ApiEndpoints.CHANNEL_GROUP]: {
    class: ChannelGroup,
    methods: [
      ApiMethod.LIST,
      ApiMethod.DELETE,
      ApiMethod.CREATE,
      ApiMethod.READ,
      ApiMethod.UPDATE,
    ],
    endpoint: "nslcGroups",
  },
  [ApiEndpoints.CHANNEL]: {
    class: Channel,
    methods: [ApiMethod.LIST],
    endpoint: "nslcChannels",
  },
  [ApiEndpoints.DASHBOARD]: {
    class: Dashboard,
    methods: [
      ApiMethod.LIST,
      ApiMethod.DELETE,
      ApiMethod.CREATE,
      ApiMethod.READ,
      ApiMethod.UPDATE,
    ],
    endpoint: "dashboardDashboards",
  },
  [ApiEndpoints.MATCHING_RULE]: {
    class: MatchingRule,
    methods: [
      ApiMethod.LIST,
      ApiMethod.DELETE,
      ApiMethod.CREATE,
      ApiMethod.READ,
      ApiMethod.UPDATE,
    ],
    endpoint: "nslcMatchingRules",
  },
  [ApiEndpoints.MEASUREMENT]: {
    class: Measurement,
    methods: [ApiMethod.READ],
    endpoint: "measurementMeasurements",
  },
  [ApiEndpoints.METRIC]: {
    class: Metric,
    methods: [
      ApiMethod.CREATE,
      ApiMethod.LIST,
      ApiMethod.READ,
      ApiMethod.UPDATE,
    ],
    endpoint: "measurementMetrics",
  },
  [ApiEndpoints.MONITOR]: {
    class: Monitor,
    methods: [
      ApiMethod.LIST,
      ApiMethod.DELETE,
      ApiMethod.CREATE,
      ApiMethod.READ,
      ApiMethod.UPDATE,
    ],
    endpoint: "measurementMonitors",
  },
  [ApiEndpoints.NETWORK]: {
    class: Network,
    methods: [ApiMethod.LIST, ApiMethod.READ],
    endpoint: "measurementNetworks",
  },
  [ApiEndpoints.ORGANIZATION]: {
    class: Organization,
    methods: [ApiMethod.LIST, ApiMethod.READ],
    endpoint: "organizationOrganizations",
  },
  [ApiEndpoints.ORGANIZATION_USER]: {
    class: User,
    methods: [
      ApiMethod.LIST,
      ApiMethod.CREATE,
      ApiMethod.READ,
      ApiMethod.UPDATE,
    ],
    endpoint: "organizationUsers",
  },
  [ApiEndpoints.TRIGGER]: {
    class: Trigger,
    methods: [
      ApiMethod.LIST,
      ApiMethod.DELETE,
      ApiMethod.CREATE,
      ApiMethod.READ,
      ApiMethod.UPDATE,
    ],
    endpoint: "measurementTrigger",
  },
  [ApiEndpoints.WIDGET]: {
    class: Widget,
    methods: [
      ApiMethod.LIST,
      ApiMethod.DELETE,
      ApiMethod.CREATE,
      ApiMethod.READ,
      ApiMethod.UPDATE,
    ],
    endpoint: "dashboardWidget",
  },
};

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

// Model type
//
export enum Apps {
  Measurement,
}
