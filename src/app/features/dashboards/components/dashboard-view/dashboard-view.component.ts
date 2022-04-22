import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { Dashboard } from "../../models/dashboard";
import { UserService } from "@features/user/services/user.service";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { UserPipe } from "@shared/pipes/user.pipe";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { OrganizationsService } from "@features/user/services/organizations.service";

@Component({
  selector: "app-dashboard-view",
  templateUrl: "./dashboard-view.component.html",
  styleUrls: ["./dashboard-view.component.scss"],
})
export class DashboardViewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  dashboards: Dashboard[] = [];
  rows = [];
  subscription: Subscription = new Subscription();
  activeDashboardId: number;
  userId: number;
  orgId: number;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  userPipe;
  orgPipe;
  selected = [];
  selectedId: number;
  columns = [];
  searchString = "";
  @ViewChild("sharingTemplate") sharingTemplate: TemplateRef<any>;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private orgService: OrganizationsService
  ) {
    this.userPipe = new UserPipe(orgService);
    this.orgPipe = new OrganizationPipe(orgService);
  }

  ngOnInit() {
    const activeDashboardSub = this.route.params.subscribe({
      next: (params: Params) => {
        this.activeDashboardId = +params.dashboardId;
      },
      error: (error) => {
        console.log("error in dashboard view " + error);
      },
    });

    const dashboardsSub = this.route.data.subscribe((data) => {
      if (data.dashboards && data.dashboards.error) {
        console.log("error in dashboard");
      } else {
        this.dashboards = [...data.dashboards];
        this.rows = data.dashboards;
      }
    });

    const userService = this.userService.user.subscribe((user) => {
      this.userId = user ? user.id : null;
      this.orgId = user ? user.orgId : null;
    });
    // this.subscription.add(dashboardsService);
    this.subscription.add(userService);
    this.subscription.add(dashboardsSub);
    this.subscription.add(activeDashboardSub);
  }

  // onSelect function for data table selection
  onSelect($event) {
    // When a row is selected, route the page and select that channel group
    const selectedId = $event.selected[0].id;
    if (selectedId) {
      this.router.navigate([selectedId], { relativeTo: this.route });
      this.selectedId = selectedId;
      this.selectDashboard(selectedId);
    }
  }

  ngAfterViewInit(): void {
    this.columns = [
      {
        name: "Dashboard Name",
        prop: "name",
        draggable: false,
        sortable: true,
      },
      { name: "Description", draggable: false, sortable: true },
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
        name: "Organization",
        prop: "orgId",
        draggable: false,
        sortable: true,
        width: 20,
        pipe: this.orgPipe,
        comparator: this.orgComparator.bind(this),
      },
      {
        name: "Sharing",
        draggable: false,
        width: 50,
        sortable: false,
        cellTemplate: this.sharingTemplate,
      },
    ];
  }

  // Getting a selected channel group and setting variables
  selectDashboard(selectedId: number) {
    this.selected = this.dashboards.filter((d) => {
      // Select row with channel group
      return d.id === selectedId;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  newDashboard() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.dashboards.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  removeFilter() {
    this.rows = [...this.dashboards];
    this.searchString = "";
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
