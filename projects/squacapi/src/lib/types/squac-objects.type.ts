import {
  Aggregate,
  ChannelGroup,
  Dashboard,
  MatchingRule,
  Metric,
  Monitor,
  Organization,
  Trigger,
  User,
  Widget,
  Archive,
  Measurement,
} from "../models";

// Imports/exports of squac types to reduce reliance on importing from module
import {
  MeasurementAggregatedListRequestParams,
  MeasurementMeasurementsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { Token } from "@pnsn/ngx-squacapi-client/model/models";

export type ApiToken = Token;

export type MeasurementParams =
  | MeasurementMeasurementsListRequestParams
  | MeasurementAggregatedListRequestParams;

/**
 * Measurement data types
 */
export type MeasurementTypes = Measurement | Aggregate | Archive;

/** SQUAC models (not measurement types) */
export type SquacObject =
  | ChannelGroup
  | Dashboard
  | MatchingRule
  | Metric
  | Monitor
  | Organization
  | Trigger
  | User
  | Widget;
