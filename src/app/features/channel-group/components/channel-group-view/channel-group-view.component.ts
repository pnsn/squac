import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { ChannelGroup } from "@core/models/channel-group";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";

// Table of channel groups
@Component({
  selector: "channel-group-view",
  templateUrl: "./channel-group-view.component.html",
  styleUrls: ["./channel-group-view.component.scss"],
})
export class ChannelGroupViewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  subscription: Subscription = new Subscription();
  userId: number;
  orgId: number;

  channelGroups: ChannelGroup[] = [];
  selectedChannelGroupId: number;

  // config for table
  columns = [];
  rows = [];
  options = {
    messages: {
      emptyMessage: "No channel groups found.",
    },
    footerLabel: "Channel Groups",
    selectionType: "single",
    displayCheck: true,
  };
  // controls in table head
  controls = {
    listenToRouter: true,
    basePath: "/channel-groups",
    resource: "ChannelGroup",
    add: {
      text: "Create ChannelGroup",
    },
    menu: {
      text: "Actions",
      options: [
        {
          text: "View",
          permission: "read",
          action: "view",
        },
        {
          text: "Edit",
          permission: "update",
          action: "edit",
        },
        {
          text: "Delete",
          permission: "delete",
          action: "delete",
        },
      ],
    },
    refresh: true,
  };

  // settings for which filters to show
  filters = {
    toggleShared: true,
    searchField: {
      text: "Type to filter...",
      props: ["owner", "orgId", "name", "description"],
    },
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private channelGroupService: ChannelGroupService
  ) {}

  ngOnInit(): void {
    if (this.route && this.route.data) {
      // get channel groups to show
      const routeSub = this.route.data.subscribe((data) => {
        if (data.channelGroups.error) {
          console.error("error in channels", data.channelGroups.error);
        } else {
          this.channelGroups = data.channelGroups;
          this.rows = [...this.channelGroups];
        }
        this.selectedChannelGroupId =
          this.route.children.length > 0
            ? +this.route.snapshot.firstChild.params.channelGroupId
            : null;
      });
      this.subscription.add(routeSub);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        {
          name: "Name",
          draggable: false,
          sortable: true,
        },
        { name: "Description", draggable: false, sortable: true },
        {
          name: "# Channels",
          prop: "channelIds.length",
          draggable: false,
          sortable: true,
          width: 20,
        },
        {
          name: "Owner",
          prop: "owner",
          draggable: false,
          sortable: true,
          width: 50,
        },
        {
          name: "Org",
          prop: "orgId",
          draggable: false,
          sortable: true,
          width: 20,
        },
      ];
    }, 0);
  }

  // get fresh groups
  refresh(): void {
    this.channelGroupService.getChannelGroups().subscribe((channelGroups) => {
      this.channelGroups = channelGroups;
      this.rows = [...this.channelGroups];
    });
  }

  // onSelect function for data table selection
  onSelect(channelGroup): void {
    this.selectedChannelGroupId = channelGroup ? channelGroup.id : null;
  }

  // event emitted from table
  onClick(event): void {
    if (event === "delete" && this.selectedChannelGroupId) {
      this.onDelete();
    }
  }

  // delete channel group
  onDelete(): void {
    this.channelGroupService
      .deleteChannelGroup(this.selectedChannelGroupId)
      .subscribe(() => {
        this.router.navigate(["./"], { relativeTo: this.route });
        this.refresh();
      });
  }

  // route to create group
  addChannelGroup(): void {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  // deselect group
  clearSelectedChannelGroup(): void {
    this.selectedChannelGroupId = null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
