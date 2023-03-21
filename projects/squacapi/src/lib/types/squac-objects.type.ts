import {
  Aggregate,
  Alert,
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
