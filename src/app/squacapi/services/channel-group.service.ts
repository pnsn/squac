import { Injectable } from "@angular/core";
import { ChannelGroup, ChannelGroupAdapter } from "../models/channel-group";
import {
  BaseApiService,
  SquacApiService,
} from "../interfaces/generic-api-service";
import {
  ApiService,
  NslcGroupsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChannelGroupService
  extends BaseApiService<ChannelGroup>
  implements SquacApiService<ChannelGroup>
{
  constructor(
    protected adapter: ChannelGroupAdapter,
    protected api: ApiService
  ) {
    super("nslcGroups", api);
  }

  read(id: number): Observable<ChannelGroup> {
    console.log("read channel groups");
    return super.read(id);
  }

  list(params?: NslcGroupsListRequestParams): Observable<ChannelGroup[]> {
    console.log("list channel groups");
    return super._list(params);
  }

  updateOrCreate(t: ChannelGroup): Observable<ChannelGroup> {
    return super._updateOrCreate(t);
  }

  delete(id: number): Observable<any> {
    return super.delete(id);
  }

  /*returns channel groups sorted into
  // {
  name: (public | private | organization),
  groups: [channelGroups]
  }
  */
  getSortedChannelGroups(params?: NslcGroupsListRequestParams) {
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
