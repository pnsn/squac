import { Injectable } from "@angular/core";
import { ChannelGroup, ChannelGroupAdapter } from "../models";
import { SquacApiService } from "../interfaces";
import { BaseApiService } from "./generic-api.service";
import {
  ApiService,
  NslcGroupsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ApiEndpoint } from "../enums";

@Injectable({
  providedIn: "root",
})
export class ChannelGroupService
  extends BaseApiService<ChannelGroup>
  implements SquacApiService<ChannelGroup>
{
  constructor(override adapter: ChannelGroupAdapter, override api: ApiService) {
    super(ApiEndpoint.CHANNEL_GROUP, api);
  }

  override read(id: number, refresh?: boolean): Observable<ChannelGroup> {
    return super.read(id, refresh);
  }

  list(
    params?: NslcGroupsListRequestParams,
    refresh?: boolean
  ): Observable<ChannelGroup[]> {
    return super._list(params, { refresh });
  }

  updateOrCreate(t: ChannelGroup): Observable<ChannelGroup> {
    return super._updateOrCreate(t);
  }

  override delete(id: number): Observable<ChannelGroup> {
    return super.delete(id);
  }

  /*returns channel groups sorted into
  // {
  name: (public | private | organization),
  groups: [channelGroups]
  }
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
