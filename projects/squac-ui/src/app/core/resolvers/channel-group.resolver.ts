import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ChannelGroup } from "squacapi";
import { Observable } from "rxjs";
import { ChannelGroupService } from "squacapi";

/**
 * Resolves a channel group or list of channel groups
 */
@Injectable({
  providedIn: "root",
})
export class ChannelGroupResolver
  implements Resolve<Observable<ChannelGroup | ChannelGroup[]>>
{
  constructor(private channelGroupService: ChannelGroupService) {}

  /**
   * Resolve a channel group or list of channel group
   *
   * @param route activated route
   * @returns observable of results
   */
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ChannelGroup | ChannelGroup[]> {
    const id = route.paramMap.get("channelGroupId");
    if (id) {
      return this.channelGroupService.read(+id);
    } else {
      return this.channelGroupService.list();
      // return all of them
    }
  }
}
