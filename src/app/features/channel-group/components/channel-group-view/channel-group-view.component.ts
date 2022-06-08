import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { ChannelGroup } from "@core/models/channel-group";
import { Subscription, filter } from "rxjs";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";

// TODO: trackbyprop to use channelID
@Component({
  selector: "channel-group-view",
  templateUrl: "./channel-group-view.component.html",
  styleUrls: ["./channel-group-view.component.scss"],
})
export class ChannelGroupViewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  channelGroups: ChannelGroup[] = [];
  subscription: Subscription = new Subscription();
  selectedChannelGroupId: number;
  columns;
  rows;
  userId;
  orgId;
  resize;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private channelGroupService: ChannelGroupService
  ) {}

  options = {
    messages: {
      emptyMessage: "No channel groups found.",
    },
    footerLabel: "Channel Groups",
    selectionType: "single",
    displayCheck: true,
  };
  controls = {
    listenToRouter: true,
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

  filters = {
    toggleShared: true,
    searchField: {
      text: "Type to filter...",
      props: ["owner", "orgId", "name", "description"],
    },
  };

  ngOnInit() {
    if (this.route && this.route.data) {
      const routeSub = this.route.data.subscribe((data) => {
        if (data.channelGroups.error) {
          console.log("error in channels");
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
    const routerEvents = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.selectedChannelGroupId =
          this.route.children.length > 0
            ? +this.route.snapshot.firstChild.params.channelGroupId
            : null;
      });

    this.subscription.add(routerEvents);
  }

  refresh() {
    this.channelGroupService.getChannelGroups().subscribe((channelGroups) => {
      this.channelGroups = channelGroups;
      this.rows = [...this.channelGroups];
    });
  }

  // onSelect function for data table selection
  onSelect(channelGroup) {
    this.selectedChannelGroupId = channelGroup ? channelGroup.id : null;
  }

  onClick(event) {
    if (event === "delete" && this.selectedChannelGroupId) {
      this.channelGroupService
        .deleteChannelGroup(this.selectedChannelGroupId)
        .subscribe(() => {
          this.refresh();
        });
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
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addChannelGroup() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  clearSelectedChannelGroup() {
    this.selectedChannelGroupId = null;
  }
}
