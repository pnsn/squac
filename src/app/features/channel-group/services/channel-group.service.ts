import { Injectable } from "@angular/core";
import { ChannelGroup, ChannelGroupAdapter } from "@core/models/channel-group";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { SquacApiService } from "@core/services/squacapi.service";
import { Params } from "@angular/router";
import { StorageService } from "@core/services/storage.service";

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
    private storage: StorageService
  ) {}

  // Gets channel groups from server
  getChannelGroups(params?: Params): Observable<ChannelGroup[]> {
    return this.squacApi.get(this.url, null, params).pipe(
      map((results) =>
        results.map((r) => {
          const group = this.channelGroupAdapter.adaptFromApi(r);
          return group;
        })
      ),
      tap((groups) => {
        this.localChannelGroups = groups;
        // this.lastAllRefresh = new Date().toDateString();
        //lst refresh of list
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
  updateLocalChannelGroup(id, channelGroup?): void {
    if (channelGroup) {
      this.localDetailChannelGroups.set(id, channelGroup);
    } else {
      this.localDetailChannelGroups.delete(id);
    }
  }

  // Gets a specific channel group with id from server
  getChannelGroup(id: number): Observable<ChannelGroup> {
    //update local on get
    return this.squacApi.get(this.url, id).pipe(
      map((response) => {
        return this.channelGroupAdapter.adaptFromApi(response);
      }),
      tap((group) => this.updateLocalChannelGroup(group.id, group))
    );
  }

  // Replaces channel group with new channel group
  updateChannelGroup(channelGroup: ChannelGroup) {
    //reset time on update
    const postData = this.channelGroupAdapter.adaptToApi(channelGroup);
    if (channelGroup.id) {
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
    return this.squacApi.delete(this.url, id);
  }
}
