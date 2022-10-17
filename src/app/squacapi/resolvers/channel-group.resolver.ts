import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ChannelGroup } from "../models/channel-group";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { ChannelGroupService } from "../services/channel-group.service";

@Injectable({
  providedIn: "root",
})
export class ChannelGroupResolver implements Resolve<Observable<any>> {
  constructor(private channelGroupService: ChannelGroupService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ChannelGroup | ChannelGroup[]> {
    const id = +route.paramMap.get("channelGroupId");
    if (id) {
      return this.channelGroupService.read(id).pipe(
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

  handleError(error): Observable<any> {
    // TODO: route to show error
    return of({ error });
  }
}
