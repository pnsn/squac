import { ReadOnlyResourceModel } from "../interfaces";
import {
  ReadOnlyChannelSerializer,
  Channel as ApiChannel,
} from "@pnsn/ngx-squacapi-client";

export interface Channel {
  nslc: string;
  code: string;
  name: string;
  sampleRate: number;
  lat: number;
  lon: number;
  elev: number;
  loc: string;
  sta: string;
  net: string;
  starttime?: string;
  endttime?: string;
}
/**
 * Describes a channel object
 */
export class Channel extends ReadOnlyResourceModel<
  ReadOnlyChannelSerializer | ApiChannel | Channel
> {
  /**
   * @returns station code string
   */
  get staCode(): string {
    return this.net + "." + this.sta;
  }

  /**
   * @returns model name
   */
  static get modelName(): string {
    return "Channel";
  }

  override fromRaw(
    data: ReadOnlyChannelSerializer | ApiChannel | Channel
  ): void {
    super.fromRaw(data);

    if ("sample_rate" in data) {
      //is serialized data
      this.code = data.code.toUpperCase();
      this.sampleRate = data.sample_rate;
      this.loc = data.loc ? data.loc.toUpperCase() : "--";
      this.sta = data.station_code.toUpperCase();
      this.net = data.network.toUpperCase();
      this.nslc = data.nslc
        ? data.nslc.toUpperCase()
        : this.net + "." + this.sta + "." + this.loc + "." + this.code;
    }
  }
}
