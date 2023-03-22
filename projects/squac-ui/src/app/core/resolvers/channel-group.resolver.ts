import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ChannelGroup } from "squacapi";
import { delay, Observable } from "rxjs";
import { ChannelGroupService } from "squacapi";
import { LoadingService } from "@core/services/loading.service";

/**
 * Resolves a channel group or list of channel groups
 */
@Injectable({
  providedIn: "root",
})
export class ChannelGroupResolver
  implements Resolve<Observable<ChannelGroup | ChannelGroup[]>>
{
  constructor(
    private channelGroupService: ChannelGroupService,
    private loadingService: LoadingService
  ) {}

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
    const delay = 500;
    let req;
    if (id) {
      req = this.channelGroupService.read(+id);
    } else {
      req = this.channelGroupService.list();
    }
    return this.loadingService.doLoading(req, null, null, delay);
  }
}
