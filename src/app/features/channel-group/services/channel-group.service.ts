import { Injectable } from "@angular/core";
import { ChannelGroup, ChannelGroupAdapter } from "@core/models/channel-group";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { SquacApiService } from "@core/services/squacapi.service";
import { Params } from "@angular/router";
import { StorageService } from "@core/services/storage.service";
import {
  ApiService,
  ReadOnlyGroupSerializer,
  NslcGroupsListRequestParams,
  NslcGroupsReadRequestParams,
  WriteOnlyGroupSerializer,
  NslcGroupsUpdateRequestParams,
  NslcGroupsCreateRequestParams,
  NslcGroupsDeleteRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class ChannelGroupService {
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
      id: id.toString(),
    };
    return this.api
      .nslcGroupsRead(params)
      .pipe(map(this.channelGroupAdapter.adaptFromApi));
  }

  // Replaces channel group with new channel group
  update(channelGroup: ChannelGroup) {
    const data: WriteOnlyGroupSerializer =
      this.channelGroupAdapter.adaptToApi(channelGroup);
    if (channelGroup.id) {
      const params: NslcGroupsUpdateRequestParams = {
        id: channelGroup.id.toString(),
        data,
      };
      return this.api
        .nslcGroupsUpdate(params)
        .pipe(map(this.channelGroupAdapter.adaptFromApi));
    }
    const params: NslcGroupsCreateRequestParams = {
      data,
    };
    return this.api
      .nslcGroupsCreate(params)
      .pipe(map(this.channelGroupAdapter.adaptFromApi));
  }

  // Deletes a channel group
  delete(id: number): Observable<any> {
    const params: NslcGroupsDeleteRequestParams = {
      id: id.toString(),
    };
    return this.api.nslcGroupsDelete(params);
  }
}
