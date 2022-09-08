import { Injectable } from "@angular/core";
import { ChannelGroup, ChannelGroupAdapter } from "@core/models/channel-group";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { SquacApiService } from "@core/services/squacapi.service";

@Injectable({
  providedIn: "root",
})
export class ChannelGroupService {
  // Squac url for groups
  private url = "nslc/groups/";
  // Store groups
  private localChannelGroups: ChannelGroup[] = [];
  // Time stamp of last refresh
  private lastRefresh: number;

  context = { test: 1 };

  constructor(
    private squacApi: SquacApiService,
    private channelGroupAdapter: ChannelGroupAdapter
  ) {}

  // Gets channel groups from server
  getChannelGroups(): Observable<ChannelGroup[]> {
    if (
      this.lastRefresh &&
      new Date().getTime() < this.lastRefresh + 5 * 60000
    ) {
      return of(this.localChannelGroups);
    }
    return this.squacApi.get(this.url).pipe(
      map((results) =>
        results.map((r) => {
          const group = this.channelGroupAdapter.adaptFromApi(r);
          this.updateLocalChannelGroup(group.id, group);
          return group;
        })
      ),
      tap(() => {
        this.lastRefresh = new Date().getTime();
      })
    );
  }

  // Save channel groups to server
  updateLocalChannelGroup(id, channelGroup?): void {
    const index = this.localChannelGroups.findIndex((cG) => cG.id === id);

    if (index > -1) {
      if (channelGroup) {
        this.localChannelGroups[index] = channelGroup;
      } else {
        this.localChannelGroups.splice(index, 1);
      }
    } else {
      this.localChannelGroups.push(channelGroup);
    }
  }

  // Gets a specific channel group with id from server
  getChannelGroup(id: number): Observable<ChannelGroup> {
    return this.squacApi.get(this.url, id).pipe(
      map((response) => {
        return this.channelGroupAdapter.adaptFromApi(response);
      }),
      tap((group) => this.updateLocalChannelGroup(group.id, group))
    );
  }

  // Replaces channel group with new channel group
  updateChannelGroup(channelGroup: ChannelGroup) {
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
