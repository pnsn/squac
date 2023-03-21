import { Component, OnInit, OnDestroy } from "@angular/core";
import { ChannelGroup } from "squacapi";
import { Router, ActivatedRoute } from "@angular/router";
import { ColumnMode, SelectionType } from "@boring.devs/ngx-datatable";
import { catchError, EMPTY, Subscription, switchMap, tap } from "rxjs";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";
import { ChannelGroupService } from "squacapi";
import { Channel } from "squacapi";
import { LoadingService } from "@core/services/loading.service";
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";

/**
 * Channel group detail with table and map
 */
@Component({
  selector: "channel-group-detail",
  templateUrl: "./channel-group-detail.component.html",
  styleUrls: ["./channel-group-detail.component.scss"],
})
export class ChannelGroupDetailComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  channelGroup: ChannelGroup; // selected channel group
  showChannel: Channel; //channels to show on map
  error: boolean;
  selectedChannels = [];
  channels: Channel[];
  // table config
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selectedRows = [];

  /** Config for detail page */
  pageOptions: PageOptions = {
    titleButtons: {
      deleteButton: true,
      addButton: true,
      editButton: true,
      closeButton: true,
    },
    path: "/channel-groups",
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmDialog: ConfirmDialogService,
    private messageService: MessageService,
    private channelGroupService: ChannelGroupService,
    public loadingService: LoadingService
  ) {}

  /**
   * subscribes to route params
   */
  ngOnInit(): void {
    // get channel group info from route

    const chanSub = this.route.params
      .pipe(
        tap(() => {
          this.error = false;
        }),
        switchMap((params) => {
          return this.loadingService.doLoading(
            this.channelGroupService.read(params["channelGroupId"]).pipe(
              catchError((error) => {
                this.error = error;
                return EMPTY;
              })
            ),
            this
          );
        })
      )
      .subscribe({
        next: (channelGroup: ChannelGroup) => {
          this.channelGroup = channelGroup;
          this.channels = channelGroup.channels as Channel[];
        },
      });
    this.subscription.add(chanSub);
  }

  /**
   * Navigate to edit path
   */
  editChannelGroup(): void {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  /**
   * unsubscribe
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Channel selected on table
   *
   * @param _event selected row?
   */
  onSelect(_event): void {
    this.showChannel = this.selectedRows[0];
  }

  /**
   * Channel selected on map
   *
   * @param event selected channel
   */
  selectChannel(event): void {
    this.selectedRows = this.channels.filter(
      (channel: Channel) => channel.staCode === event.code
    );
  }

  /**
   * Add channel group to a dashboard
   */
  addToDashboard(): void {
    this.router.navigate(["/", "dashboards", "new"], {
      relativeTo: this.route,
      queryParams: { group: this.channelGroup.id },
    });
  }

  /**
   * Close container and route to parent
   */
  closeChannelGroup(): void {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  /**
   * Delete group after confirmation
   */
  onDelete(): void {
    this.confirmDialog.open({
      title: `Delete ${this.channelGroup.name}`,
      message: "Are you sure? This action is permanent.",
      cancelText: "Cancel",
      confirmText: "Delete",
    });
    this.confirmDialog.confirmed().subscribe((confirm) => {
      if (confirm) {
        this.delete();
      }
    });
  }

  /**
   * Delete channel group
   */
  delete(): void {
    this.channelGroupService.delete(this.channelGroup.id).subscribe({
      next: () => {
        this.closeChannelGroup();
        this.messageService.message("Channel group deleted.");
      },
      error: () => {
        this.messageService.error("Could not delete channel group");
      },
    });
  }
}
