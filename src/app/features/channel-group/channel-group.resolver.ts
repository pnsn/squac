import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";
import { ChannelGroup } from "@core/models/channel-group";
import { LoadingService } from "@core/services/loading.service";
import { MessageService } from "@core/services/message.service";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { ChannelGroupService } from "./services/channel-group.service";

@Injectable({
  providedIn: "root",
})
export class ChannelGroupResolver implements Resolve<Observable<any>> {
  constructor(
    private channelGroupService: ChannelGroupService,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<ChannelGroup | ChannelGroup[]> {
    const id = +route.paramMap.get("channelGroupId");
    if (id) {
      console.log("I'm being resolved");
      // return this.loadingService.doLoading(
      //   this.channelGroupService.getChannelGroup(id).pipe(
      //     delay(400),
      //     catchError((error) => {
      //       this.messageService.error("Could not load channel group.");
      //       return this.handleError(error);
      //     })
      //   ),
      //   this.channelGroupService.context
      // );
      return this.channelGroupService.getChannelGroup(id).pipe(
        catchError((error) => {
          this.messageService.error("Could not load channel group.");
          return this.handleError(error);
        })
      );
    } else {
      // return this.loadingService.doLoading(
      //   this.channelGroupService.getChannelGroups().pipe(
      //     delay(20000),
      //     catchError((error) => {
      //       this.messageService.error("Could not load channel groups.");
      //       return this.handleError(error);
      //     })
      //   ),
      //   this.channelGroupService.context
      // );
      console.log("resolve groups");
      return this.channelGroupService.getChannelGroups().pipe(
        catchError((error) => {
          this.messageService.error("Could not load channel groups.");
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
