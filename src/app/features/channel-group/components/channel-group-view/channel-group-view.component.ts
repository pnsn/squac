import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { ChannelGroup } from "@core/models/channel-group";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { OrganizationService } from "@user/services/organization.service";
import { UserService } from "@user/services/user.service";
import { Organization } from "@user/models/organization";
import { filter, tap } from "rxjs/operators";
import { ChannelGroupService } from "@channelGroup/services/channel-group.service";
import { UserPipe } from "@shared/pipes/user.pipe";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";

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
  selected: ChannelGroup[];
  subscription: Subscription = new Subscription();
  selectedChannelGroupId: number;
  showOnlyUserOrg = true;
  userOrg: Organization;
  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  temp = [];
  userPipe: UserPipe;
  orgPipe: OrganizationPipe;
  columns;
  rows;
  searchString;
  userId;
  orgId;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private orgService: OrganizationService,
    private channelGroupService: ChannelGroupService
  ) {
    this.userPipe = new UserPipe(orgService);
    this.orgPipe = new OrganizationPipe(orgService);
  }

  options = {
    messages: {
      emptyMessage: "No channel groups found.",
    },
    footerLabel: "Channel Groups",
    selectionType: "single",
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
    this.selected = [];
    if (this.route.parent && this.route.parent.data) {
      const routeSub = this.route.parent.data.subscribe((data) => {
        if (data.channelGroups.error) {
          console.log("error in channels");
        } else {
          this.channelGroups = data.channelGroups;
          this.rows = [...this.channelGroups];
        }
      });
      this.subscription.add(routeSub);
    }
  }

  refresh() {
    this.channelGroupService.getChannelGroups().subscribe((channelGroups) => {
      this.channelGroups = channelGroups;
      this.rows = [...this.channelGroups];
    });
  }

  // onSelect function for data table selection
  onSelect(channelGroup) {
    this.selectedChannelGroupId = channelGroup.id;
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
