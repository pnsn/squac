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
