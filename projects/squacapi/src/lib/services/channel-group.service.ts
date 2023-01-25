import { Injectable } from "@angular/core";
import { ChannelGroup } from "../models";
import { SquacApiService } from "../interfaces";
import {
  ApiService,
  NslcGroupsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";
import { BaseWriteableApiService } from "./generic-api.service";

/**
 * Service for managing channel groups
 */
@Injectable({
  providedIn: "root",
})
export class ChannelGroupService extends BaseWriteableApiService<ChannelGroup> {
  constructor(override api: ApiService) {
    super(ApiEndpoint.CHANNEL_GROUP, api);
  }
  /*returns channel groups sorted into
  // {
  name: (public | private | organization),
  groups: [channelGroups]
  }
  */

  /**
   * Returns channel groups sorted into public, private or org
   *
   * @param params search params
   * @returns channel groups sorted
   */
  getSortedChannelGroups(
    params?: NslcGroupsListRequestParams
  ): Observable<unknown[]> {
    const privateGroups: ChannelGroup[] = [];
    const publicGroups: ChannelGroup[] = [];
    const organizationGroups: ChannelGroup[] = [];
    return this.list(params).pipe(
      map((channelGroups) => {
        channelGroups.forEach((cg) => {
          if (cg.shareAll) {
            publicGroups.push(cg);
          } else if (cg.shareOrg) {
            organizationGroups.push(cg);
          } else {
            privateGroups.push(cg);
          }
        });

        return [
          {
            name: "Private Groups",
            groups: privateGroups,
          },
          {
            name: "Organization Groups",
            groups: organizationGroups,
          },
          {
            name: "All SQUAC Groups",
            groups: publicGroups,
          },
        ];
      })
    );
  }
}

export interface ChannelGroupService extends SquacApiService<ChannelGroup> {
  read(id: number, refresh?: boolean): Observable<ChannelGroup>;
  list(
    params?: NslcGroupsListRequestParams,
    refresh?: boolean
  ): Observable<ChannelGroup[]>;
  updateOrCreate(t: ChannelGroup): Observable<ChannelGroup>;
  delete(id: number): Observable<ChannelGroup>;
}
