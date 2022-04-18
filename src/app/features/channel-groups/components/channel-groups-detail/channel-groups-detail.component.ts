import { Component, OnInit, OnDestroy } from "@angular/core";
import { ChannelGroup } from "@core/models/channel-group";
import { Router, ActivatedRoute } from "@angular/router";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { Subscription } from "rxjs";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";
import { ChannelGroupsService } from "@features/channel-groups/services/channel-groups.service";

@Component({
  selector: "app-channel-groups-detail",
  templateUrl: "./channel-groups-detail.component.html",
  styleUrls: ["./channel-groups-detail.component.scss"],
})
export class ChannelGroupsDetailComponent implements OnInit, OnDestroy {
  channelGroup: ChannelGroup;
  channelGroupSub: Subscription;
  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  error: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmDialog: ConfirmDialogService,
    private messageService: MessageService,
    private channelGroupService: ChannelGroupsService
  ) {}

  ngOnInit(): void {
    this.channelGroupSub = this.route.data.subscribe((data) => {
      if (data.channelGroup.error) {
        this.error = true;
      } else {
        this.error = false;
        this.channelGroup = data.channelGroup;
      }
    });
  }

  editChannelGroup() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.channelGroupSub.unsubscribe();
  }

  closeChannelGroup() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  // Give a warning to user that delete will also delete widgets
  onDelete() {
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
  delete() {
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
