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
  NslcGroupsReadRequestParams,
} from "@pnsn/ngx-squacapi-client";

@Injectable({
  providedIn: "root",
})
export class ChannelGroupService {
  // Squac url for groups
  private url = "nslc/groups/";
  // Store groups
  private localChannelGroups: ChannelGroup[] = [];
  private localDetailChannelGroups = new Map<number, ChannelGroup>();
  private lastRefresh = new Map<number, number>(); //CgId:
  // Time stamp of last refresh
  private lastAllRefresh: number;

  context = { test: 1 };

  constructor(
    private squacApi: SquacApiService,
    private channelGroupAdapter: ChannelGroupAdapter,
    private storage: StorageService,
    private api: ApiService
  ) {}

  // Gets channel groups from server
  getChannelGroups(params?: Params): Observable<ChannelGroup[]> {
    console.log(params);
    const data = this.storage.getData(this.url);

    this.api.nslcGroupsList(null).subscribe({
      next: (response: ReadOnlyGroupSerializer[]) => {
        console.log(response);
      },
    });
    return data
      ? of(data)
      : this.squacApi.get(this.url, null, params).pipe(
          map((results) =>
            results.map((r) => {
              const group = this.channelGroupAdapter.adaptFromApi(r);
              return group;
            })
          ),
          tap((groups) => {
            this.storage.setData(this.url, groups);
          })
        );
  }

  /*returns channel groups sorted into
  // {
  name: (public | private | organization),
  groups: [channelGroups]
  }
  */
  getSortedChannelGroups(params?: Params) {
    const privateGroups: ChannelGroup[] = [];
    const publicGroups: ChannelGroup[] = [];
    const organizationGroups: ChannelGroup[] = [];
    return this.getChannelGroups(params).pipe(
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

  // Save channel groups to server
  updateLocalChannelGroup(id?, channelGroup?): void {
    const key = this.url + id;
    this.storage.removeData(key);
    this.storage.removeData(this.url);
  }

  // Gets a specific channel group with id from server
  getChannelGroup(id: number): Observable<ChannelGroup> {
    const key = this.url + id;
    const data = this.storage.getData(key);

    return data
      ? of(data)
      : this.squacApi.get(this.url, id).pipe(
          map((response) => {
            return this.channelGroupAdapter.adaptFromApi(response);
          }),
          tap((group) => this.storage.setData(key, group))
        );
  }

  // Replaces channel group with new channel group
  updateChannelGroup(channelGroup: ChannelGroup) {
    //reset time on update
    // will return group object
    const postData = this.channelGroupAdapter.adaptToApi(channelGroup);
    if (channelGroup.id) {
      this.storage.removeData(channelGroup.id);
      return this.squacApi.put(this.url, channelGroup.id, postData).pipe(
        map((response) => this.channelGroupAdapter.adaptFromApi(response)),
        tap((group) => this.updateLocalChannelGroup(group.id, group))
      );
    }
    return this.squacApi.post(this.url, postData).pipe(
      map((response) => this.channelGroupAdapter.adaptFromApi(response)),
      tap((group) => this.updateLocalChannelGroup(group.id, group))
    );
  }

  // Deletes a channel group
  deleteChannelGroup(id: number): Observable<any> {
    // remove group from local
    this.updateLocalChannelGroup(id);
    return this.squacApi.delete(this.url, id).pipe(
      tap(() => {
        this.storage.removeData(id);
      })
    );
  }
}
