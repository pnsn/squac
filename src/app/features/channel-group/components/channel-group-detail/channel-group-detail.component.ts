import { Component, OnInit, OnDestroy } from "@angular/core";
import { ChannelGroup } from "@core/models/channel-group";
import { Router, ActivatedRoute } from "@angular/router";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { Subscription } from "rxjs";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import { Channel } from "@core/models/channel";

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

  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selectedRows = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmDialog: ConfirmDialogService,
    private messageService: MessageService,
    private channelGroupService: ChannelGroupService
  ) {}

  ngOnInit(): void {
    // get channel group info from route
    const chanSub = this.route.data.subscribe((data) => {
      if (data.channelGroup.error) {
        this.error = true;
      } else {
        this.error = false;
        this.channelGroup = data.channelGroup;
      }
    });
    this.subscription.add(chanSub);
  }

  // route to edit path
  editChannelGroup(): void {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }

  //channel selected on table
  onSelect(_event): void {
    this.showChannel = this.selectedRows[0];
  }

  //channel selected on map
  selectChannel(event) {
    this.selectedRows = event.inGroupChannels;
  }

  // close container and route to parent
  closeChannelGroup(): void {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  // Give a warning to user that delete will also delete widgets
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

  // Delete channel group
  delete(): void {
    this.channelGroupService.deleteChannelGroup(this.channelGroup.id).subscribe(
      () => {
        this.closeChannelGroup();
        this.messageService.message("Channel group deleted.");
      },
      () => {
        this.messageService.error("Could not delete channel group");
      }
    );
  }
}
