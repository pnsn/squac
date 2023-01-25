import { ReadOnlyResourceModel } from "../interfaces";
import { ReadOnlyMeasurementSerializer } from "@pnsn/ngx-squacapi-client";

/**
 *
 */
export interface Measurement {
  metric: number;
  channel: number;
  value: number;
  starttime: string;
  endtime: string;
}

/**
 * describes a measurement
 */
export class Measurement extends ReadOnlyResourceModel<
  ReadOnlyMeasurementSerializer | Measurement
> {
  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Measurement";
  }
}
