// Imports/exports of squac types to reduce reliance on importing from module
import * as squacapi from "@pnsn/ngx-squacapi-client/model/models";
export * from "@pnsn/ngx-squacapi-client/model/models";

// channels
export type ApiChannel = squacapi.Channel;
export type ReadChannel = squacapi.ReadOnlyChannelSerializer | ApiChannel;

// channel groups
export type ApiChannelGroup = squacapi.NslcGroup;
export type ReadChannelGroup =
  | squacapi.ReadOnlyGroupDetailSerializer
  | squacapi.ReadOnlyGroupSerializer
  | squacapi.NslcGroup;
export type WriteChannelGroup = squacapi.WriteOnlyGroupSerializer;

// metrics
export type ApiMetric = squacapi.Metric;
export type ReadMetric = squacapi.ReadOnlyMetricSerializer | ApiMetric;
export type WriteMetric = squacapi.WriteOnlyMetricSerializer;

// matching rules
export type ReadMatchingRule = squacapi.ReadOnlyMatchingRuleSerializer;

// networks
export type ReadNetwork = squacapi.ReadOnlyNetworkSerializer;

// dashboards
export type ReadDashboard =
  | squacapi.ReadOnlyDashboardDetailSerializer
  | squacapi.ReadOnlyDashboardSerializer;
export type WriteDashboard = squacapi.WriteOnlyDashboardSerializer;

// Alerts
export type ReadAlert =
  | squacapi.ReadOnlyAlertDetailSerializer
  | squacapi.ReadOnlyAlertSerializer;

// monitors
export type ReadMonitor =
  | squacapi.ReadOnlyMonitorDetailSerializer
  | squacapi.ReadOnlyMonitorSerializer;

export type WriteMonitor = squacapi.WriteOnlyMonitorSerializer;

// triggers
export type ApiTrigger = squacapi.Trigger;
export type ReadTrigger = ApiTrigger | squacapi.ReadOnlyTriggerSerializer;
export type WriteTrigger = squacapi.WriteOnlyTriggerSerializer;

// organization
export type ReadOrganization = squacapi.ReadOnlyOrganizationSerializer;

// users
export type ApiUserSimple = squacapi.UserSimple;
export type ApiUserGroup = squacapi.UserGroup;
export type ReadUser =
  | squacapi.ReadOnlyUserMeSerializer
  | squacapi.ReadOnlyUserSerializer
  | squacapi.ReadOnlyUserFullSerializer
  | squacapi.ReadOnlyUserSimpleSerializer
  | ApiUserSimple;
export type WriteUser =
  | squacapi.WriteOnlyUserFullSerializer
  | squacapi.WriteOnlyUserMeSerializer
  | squacapi.WriteOnlyUserSerializer;

// measurements
export type ReadArchive =
  | squacapi.ReadOnlyArchiveDaySerializer
  | squacapi.ReadOnlyArchiveHourSerializer
  | squacapi.ReadOnlyArchiveWeekSerializer
  | squacapi.ReadOnlyArchiveMonthSerializer;

export type ReadMeasurement = squacapi.ReadOnlyMeasurementSerializer;

//widgets
export type ReadWidget = squacapi.ReadOnlyWidgetDetailSerializer;
export type WriteWidget = squacapi.WriteOnlyWidgetSerializer;

export type ApiToken = squacapi.Token;
