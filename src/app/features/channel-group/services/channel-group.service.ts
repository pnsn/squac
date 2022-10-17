import { Injectable } from "@angular/core";
import { ChannelGroup, ChannelGroupAdapter } from "@core/models/channel-group";
import { ReadWriteDeleteApiService } from "@core/models/generic-api-service";
import {
  ApiService,
  NslcGroupsListRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ChannelGroupService extends ReadWriteDeleteApiService<ChannelGroup> {
  constructor(
    protected adapter: ChannelGroupAdapter,
    protected api: ApiService
  ) {
    super("nslcGroups", api);
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
