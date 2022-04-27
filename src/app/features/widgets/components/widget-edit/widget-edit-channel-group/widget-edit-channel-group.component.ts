import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterViewInit,
  ViewChild,
} from "@angular/core";
import { ChannelGroup } from "@core/models/channel-group";
import { ChannelGroupsService } from "@features/channel-groups/services/channel-groups.service";
import { WidgetEditService } from "@features/widgets/services/widget-edit.service";
import { Subscription } from "rxjs";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { Organization } from "@features/user/models/organization";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { OrganizationsService } from "@features/user/services/organizations.service";
import { UserService } from "@features/user/services/user.service";
import { UserPipe } from "@shared/pipes/user.pipe";

@Component({
  selector: "widget-edit-channel-group",
  templateUrl: "./widget-edit-channel-group.component.html",
  styleUrls: ["./widget-edit-channel-group.component.scss"],
})
export class WidgetEditChannelGroupComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() channelGroups: ChannelGroup[];
  @ViewChild("channelTable") channelTable;
  availableChannelGroups: ChannelGroup[];
  selectedChannelGroup: ChannelGroup[] = [];
  subscriptions: Subscription = new Subscription();
  selectedChannelGroupId;
  loading = true;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  done = false;
  showOnlyUserOrg = true;
  userOrg: Organization;
  temp;
  columns;
  userPipe: UserPipe;
  orgPipe: OrganizationPipe;

  constructor(
    private channelGroupsService: ChannelGroupsService,
    private widgetEditService: WidgetEditService,
    private userService: UserService,
    private orgService: OrganizationsService
  ) {
    this.userPipe = new UserPipe(orgService);
    this.orgPipe = new OrganizationPipe(orgService);
  }

  ngOnInit() {
    this.availableChannelGroups = this.channelGroups;
    const group = this.widgetEditService.getChannelGroup();
    if (group) {
      this.selectedChannelGroup[0] = group;
    }

    this.loading = false;

    const orgSub = this.orgService
      .getOrganization(this.userService.userOrg)
      .subscribe((org) => {
        this.userOrg = org;
        this.filterOrg();
      });

    this.subscriptions.add(orgSub);

    this.columns = [
      { name: "Name", draggable: false, sortable: true },
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
        pipe: this.userPipe,
        comparator: this.userComparator.bind(this),
      },
      {
        name: "Org",
        prop: "orgId",
        draggable: false,
        sortable: true,
        width: 20,
        pipe: this.orgPipe,
        comparator: this.orgComparator.bind(this),
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.availableChannelGroups) {
      this.availableChannelGroups = [...this.availableChannelGroups]; // This is input into <ngx-datatable>
      this.channelTable.recalculate(); // ngx-datatable reference
    }
    // store copy of channel groups
    this.checkValid();
  }
  // onSelect function for data table selection
  onSelect($event) {
    // When a row is selected, route the page and select that channel group
    const selectedId = $event.selected[0].id;
    if (selectedId) {
      this.selectedChannelGroupId = selectedId;
      this.selectChannelGroup(selectedId);
    }
  }

  // Getting a selected channel group and setting variables
  selectChannelGroup(selectedChannelGroupId: number) {
    this.selectedChannelGroup = this.channelGroups.filter((cg) => {
      // Select row with channel group
      return cg.id === selectedChannelGroupId;
    });
    this.checkValid();
    this.widgetEditService.updateChannelGroup(this.selectedChannelGroup[0]);
  }

  viewChannels(id) {
    console.log(id);
  }
  checkValid() {
    this.done = this.selectedChannelGroup.length > 0;
  }

  getChannelsForChannelGroup(group) {
    this.loading = true;
    this.selectedChannelGroup = group;

    if (this.selectedChannelGroup[0].id) {
      this.widgetEditService.updateChannelGroup(this.selectedChannelGroup);
      const channelGroupsSub = this.channelGroupsService
        .getChannelGroup(this.selectedChannelGroup[0].id)
        .subscribe(
          (channelGroup) => {
            this.selectedChannelGroup[0] = channelGroup;
            this.loading = false;
          },
          (error) => {
            console.log("error in channel grouups edit update: " + error);
          }
        );

      this.subscriptions.add(channelGroupsSub);
    }
  }

  filterOrg() {
    // filter our data
    if (
      this.channelGroups &&
      this.channelGroups.length > 0 &&
      this.userOrg.id
    ) {
      this.availableChannelGroups = this.channelGroups.filter((cg) => {
        return this.showOnlyUserOrg ? cg.orgId === this.userOrg.id : true;
      });
    }
  }

  userComparator(userIdA, userIdB) {
    const userNameA = this.userPipe.transform(userIdA).toLowerCase();
    const userNameB = this.userPipe.transform(userIdB).toLowerCase();

    if (userNameA < userNameB) {
      return -1;
    }
    if (userNameA > userNameB) {
      return 1;
    }
  }

  orgComparator(orgIdA, orgIdB) {
    const orgNameA = this.orgPipe.transform(orgIdA).toLowerCase();
    const orgNameB = this.orgPipe.transform(orgIdB).toLowerCase();

    if (orgNameA < orgNameB) {
      return -1;
    }
    if (orgNameA > orgNameB) {
      return 1;
    }
  }
}
