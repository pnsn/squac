import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { ChannelGroup } from "@core/models/channel-group";
import { Subscription } from "rxjs";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { OrganizationService } from "@user/services/organization.service";
import { UserService } from "@user/services/user.service";
import { UserPipe } from "@shared/pipes/user.pipe";

@Component({
  selector: "widget-edit-channel-group",
  templateUrl: "./widget-edit-channel-group.component.html",
  styleUrls: ["./widget-edit-channel-group.component.scss"],
})
export class WidgetEditChannelGroupComponent
  implements OnInit, OnDestroy, OnChanges
{
  //inputs
  @Input() channelGroups: ChannelGroup[];
  @Input() channelGroup: ChannelGroup;
  @Output() channelGroupChange = new EventEmitter<ChannelGroup>();

  subscriptions: Subscription = new Subscription();

  done = false;

  // permissions
  showOnlyUserOrg = true;
  userOrgName: string;
  orgId: number;
  userPipe: UserPipe;
  orgPipe: OrganizationPipe;

  //datatable
  @ViewChild("channelTable") channelTable;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  selected: ChannelGroup[] = [];
  rows = [];
  columns = [];

  constructor(
    private userService: UserService,
    private orgService: OrganizationService
  ) {
    this.userPipe = new UserPipe(orgService);
    this.orgPipe = new OrganizationPipe(orgService);
  }

  ngOnInit() {
    this.orgId = this.userService.userOrg;

    this.userOrgName = this.orgService.getOrgName(this.userService.userOrg);

    this.filterOrg();

    this.columns = [
      {
        width: 30,
        canAutoResize: false,
        sortable: false,
        draggable: false,
        resizeable: false,
        headerCheckboxable: true,
        checkboxable: true,
      },
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

  ngOnChanges(changes: SimpleChanges): void {
    //update channel groups
    if (changes.channelGroups && changes.channelGroups.currentValue) {
      this.rows = [...this.channelGroups];
    }

    //update selected channel
    if (changes.channelGroup && changes.channelGroup.currentValue) {
      this.selected[0] = this.rows.find((cG) => {
        return cG.id === this.channelGroup.id;
      });
      this.checkValid();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // onSelect function for data table selection
  onSelect({ selected }) {
    this.channelGroupChange.emit(selected[0]);
  }

  checkValid() {
    this.done = this.selected.length > 0;
  }

  //filter out other orgs data
  filterOrg() {
    if (this.channelGroups && this.channelGroups.length > 0 && this.orgId) {
      const temp = this.channelGroups.filter((cg) => {
        return this.showOnlyUserOrg ? cg.orgId === this.orgId : true;
      });

      this.rows = [...temp];
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
