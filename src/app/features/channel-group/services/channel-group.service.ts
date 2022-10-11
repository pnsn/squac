import { Injectable } from "@angular/core";
import { ChannelGroup, ChannelGroupAdapter } from "@core/models/channel-group";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  ApiService,
  ReadOnlyGroupSerializer,
  NslcGroupsListRequestParams,
  NslcGroupsReadRequestParams,
  NslcGroupsUpdateRequestParams,
  NslcGroupsCreateRequestParams,
  NslcGroupsDeleteRequestParams,
} from "@pnsn/ngx-squacapi-client";
import { GenericApiService } from "@core/models/generic-api-service";

@Injectable({
  providedIn: "root",
})
export class ChannelGroupService implements GenericApiService<ChannelGroup> {
  constructor(
    private channelGroupAdapter: ChannelGroupAdapter,
    private api: ApiService
  ) {}

  // Gets all channel groups from server that match params
  list(params?: NslcGroupsListRequestParams): Observable<ChannelGroup[]> {
    return this.api.nslcGroupsList(params).pipe(
      map((response: ReadOnlyGroupSerializer[]) => {
        return response.map(this.channelGroupAdapter.adaptFromApi);
      })
    );
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

  // Gets channel group with id from server
  read(id: number): Observable<ChannelGroup> {
    const params: NslcGroupsReadRequestParams = {
      id: `${id}`,
    };
    return this.api
      .nslcGroupsRead(params)
      .pipe(map(this.channelGroupAdapter.adaptFromApi));
  }

  updateOrCreate(channelGroup: ChannelGroup): Observable<ChannelGroup> {
    if (channelGroup.id) {
      return this.update(channelGroup);
    }
    return this.create(channelGroup);
  }

  create(channelGroup: ChannelGroup): Observable<ChannelGroup> {
    const params: NslcGroupsCreateRequestParams = {
      data: this.channelGroupAdapter.adaptToApi(channelGroup),
    };
    return this.api
      .nslcGroupsCreate(params)
      .pipe(map(this.channelGroupAdapter.adaptFromApi));
  }

  // Replaces channel group with new channel group
  update(channelGroup: ChannelGroup): Observable<ChannelGroup> {
    const params: NslcGroupsUpdateRequestParams = {
      id: `${channelGroup.id}`,
      data: this.channelGroupAdapter.adaptToApi(channelGroup),
    };
    return this.api
      .nslcGroupsUpdate(params)
      .pipe(map(this.channelGroupAdapter.adaptFromApi));
  }

  // Deletes a channel group
  delete(id: number): Observable<any> {
    const params: NslcGroupsDeleteRequestParams = {
      id: `${id}`,
    };
    return this.api.nslcGroupsDelete(params);
  }
}
