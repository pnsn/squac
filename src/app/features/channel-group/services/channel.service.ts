import { Injectable } from "@angular/core";

import { map } from "rxjs/operators";
import { Channel, ChannelAdapter } from "@core/models/channel";
import { Observable } from "rxjs";
import { SquacApiService } from "@core/services/squacapi.service";
import { Params } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ChannelService {
  private url = "nslc/channels/";
  constructor(
    private squacApi: SquacApiService,
    private channelAdapter: ChannelAdapter
  ) {}

  getChannelsByFilters(filters: Params): Observable<Channel[]> {
    return this.squacApi
      .get(this.url, null, filters)
      .pipe(
        map((response) =>
          response.map((r) => this.channelAdapter.adaptFromApi(r))
        )
      );
  }
}
