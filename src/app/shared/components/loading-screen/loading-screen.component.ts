import { Component, OnInit, OnDestroy } from "@angular/core";
import { ChannelGroup } from "@core/models/channel-group";
import { LoadingService } from "@core/services/loading.service";
import { ChannelGroupService } from "@features/channel-group/services/channel-group.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-loading-screen",
  templateUrl: "./loading-screen.component.html",
  styleUrls: ["./loading-screen.component.scss"],
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  loading: boolean;
  statuses: string[] = []; //statuses to show
  constructor(
    // public loadingService: LoadingService,
    public channelGroupsService: ChannelGroupService
  ) {
    this.context = this.channelGroupsService.context;
  }
  context;
  ngOnInit(): void {
    // console.log(this.loadingService.isLoading({ test: 1 }));
    // // listens for loading status
    // const loadingSub = this.loadingService.loading.subscribe((loading) => {
    //   this.loading = loading;
    // });
    // // listens for loading text
    // const loadStatusSub = this.loadingService.loadingStatus.subscribe(
    //   (text) => {
    //     if (text) {
    //       this.statuses.push(text);
    //       if (this.statuses.length > 1) {
    //         this.statuses.splice(0, 1);
    //       }
    //     } else {
    //       this.statuses = [];
    //     }
    //   }
    // // );
    // this.subscription.add(loadStatusSub);
    // this.subscription.add(loadingSub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
