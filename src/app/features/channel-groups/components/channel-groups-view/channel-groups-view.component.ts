import { Component, OnInit, OnDestroy, AfterViewInit, Pipe } from '@angular/core';
import { ChannelGroup } from '@core/models/channel-group';
import { pipe, Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { OrganizationsService } from '@features/user/services/organizations.service';
import { UserService } from '@features/user/services/user.service';
import { Organization } from '@features/user/models/organization';
import { filter, tap } from 'rxjs/operators';
import { ChannelGroupsService } from '@features/channel-groups/services/channel-groups.service';
import { UserPipe } from '@shared/pipes/user.pipe';
import { OrganizationPipe } from '@shared/pipes/organization.pipe';

//TODO: trackbyprop to use channelID
@Component({
  selector: 'app-channel-groups-view',
  templateUrl: './channel-groups-view.component.html',
  styleUrls: ['./channel-groups-view.component.scss'],
})
export class ChannelGroupsViewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  channelGroups: ChannelGroup[];
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private orgService: OrganizationsService,
    private channelGroupsService: ChannelGroupsService,
  ) {
    this.userPipe = new UserPipe(orgService)
    this.orgPipe = new OrganizationPipe(orgService)
  }


  ngOnInit() {
    this.selected = [];
    if (this.route.parent && this.route.parent.data) {
      const routeSub = this.route.parent.data.subscribe(
        data => {
          if (data.channelGroups.error){
            console.log('error in channels');
          } else {
            this.channelGroups = data.channelGroups;
          }
        }
      );
      this.subscription.add(routeSub);
    }

    const orgSub = this.orgService
      .getOrganization(this.userService.userOrg)
      .subscribe((org) => {
        this.userOrg = org;
        this.filterOrg();
      });

    // store copy of channel groups
    this.temp = [...this.channelGroups];

    const routerEvents = this.router.events
    .pipe(
      filter(e => e instanceof NavigationEnd),
      tap((event) => {
        if (!this.route.firstChild) {
          this.clearSelectedChannelGroup();
        }
      })

    ).subscribe();

    if (this.route.firstChild) {
      this.selectedChannelGroupId =
        +this.route.firstChild.snapshot.params.channelGroupId;
      this.selectChannelGroup(this.selectedChannelGroupId);
    }

    this.subscription.add(routerEvents);
    this.subscription.add(orgSub);

    this.columns = [
      {name:'Name', draggable:'false',sortable:'true' },
      {name:'Description', draggable:'false',sortable:'true'},
      {name:'# Channels', prop: 'channelIds.length', draggable:'false',sortable:'true'},
      {name:'Owner', prop:'owner', draggable: 'false', sortable:'true', width:"100", pipe: this.userPipe, comparator: this.userComparator.bind(this)},
      {name:'Org', prop:'orgId',  draggable: 'false', sortable:'true', width:"30", pipe: this.orgPipe, comparator: this.orgComparator.bind(this) }
    ];
  }

  refresh() {
    this.channelGroupsService.getChannelGroups().subscribe(
      channelGroups => {
        this.channelGroups = channelGroups;
      }
    );
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.selected = [...this.selected];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addChannelGroup() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  clearSelectedChannelGroup() {
    this.selectedChannelGroupId = null;
    this.selected = [];
  }

  // Getting a selected channel group and setting variables
  selectChannelGroup(selectedChannelGroupId: number) {
    this.selected = this.channelGroups.filter((cg) => {
      // Select row with channel group
      return cg.id === selectedChannelGroupId;
    });
  }

  // onSelect function for data table selection
  onSelect($event) {
    // When a row is selected, route the page and select that channel group
    const selectedId = $event.selected[0].id;
    if (selectedId) {
      this.router.navigate([selectedId], { relativeTo: this.route });
      this.selectedChannelGroupId = selectedId;
      this.selectChannelGroup(selectedId);
    }
  }

  filterOrg() {
    // filter our data
    const temp = this.temp.filter((cg) => {
      return this.showOnlyUserOrg ? cg.orgId === this.userOrg.id : true;
    });

    this.channelGroups = temp;
  }

  userComparator(userIdA, userIdB) {
    const userNameA = this.userPipe.transform(userIdA).toLowerCase();
    const userNameB = this.userPipe.transform(userIdB).toLowerCase();

    if(userNameA < userNameB) {
      return -1;
    }
    if(userNameA > userNameB) {
      return 1;
    }
  }

  orgComparator(orgIdA, orgIdB) {
    const orgNameA = this.orgPipe.transform(orgIdA).toLowerCase();
    const orgNameB = this.orgPipe.transform(orgIdB).toLowerCase();

    if(orgNameA < orgNameB) {
      return -1;
    }
    if(orgNameA > orgNameB) {
      return 1;
    }
  }
}
