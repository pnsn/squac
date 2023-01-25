import { ReadOnlyResourceModel } from "../interfaces";
import { ReadOnlyMeasurementSerializer } from "@pnsn/ngx-squacapi-client";
/**
 * describes a measurement
 */
export class Measurement extends ReadOnlyResourceModel<ReadOnlyMeasurementSerializer> {
  metric: number;
  channel: number;
  value: number;
  starttime: string;
  endtime: string;

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Measurement";
  }
}
