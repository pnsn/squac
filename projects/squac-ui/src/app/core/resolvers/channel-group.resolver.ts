import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ChannelGroup } from "squacapi";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { ChannelGroupService } from "squacapi";

/**
 *
 */
@Injectable({
  providedIn: "root",
})
export class ChannelGroupResolver implements Resolve<Observable<any>> {
  constructor(private channelGroupService: ChannelGroupService) {}

  /**
   *
   * @param route
   */
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ChannelGroup | ChannelGroup[]> {
    const id = route.paramMap.get("channelGroupId");
    if (id) {
      return this.channelGroupService.read(+id).pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
    } else {
      return this.channelGroupService.list().pipe(
        catchError((error) => {
          return this.handleError(error);
        })
      );
      // return all of them
    }
  }

  /**
   *
   * @param error
   */
  handleError(error: unknown): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }
}
