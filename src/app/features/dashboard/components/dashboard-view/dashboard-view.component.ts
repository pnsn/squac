import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DashboardService } from "@features/dashboard/services/dashboard.service";
import { Edit } from "leaflet";
import { Subscription } from "rxjs";
import { Dashboard } from "../../models/dashboard";

@Component({
  selector: "dashboard-view",
  templateUrl: "./dashboard-view.component.html",
  styleUrls: ["./dashboard-view.component.scss"],
})
export class DashboardViewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild("sharingTemplate") sharingTemplate: TemplateRef<any>;
  @ViewChild("nameTemplate") nameTemplate: TemplateRef<any>;
  subscription: Subscription = new Subscription();

  dashboards: Dashboard[] = [];
  rows: Dashboard[];
  columns;
  selectedDashboardId;

  options = {
    messages: {
      emptyMessage: "No dashboards found.",
    },
    footerLabel: "Dashboards",
    selectionType: "single",
  };
  controls = {
    listenToRouter: true,
    resource: "Dashboard",
    add: {
      text: "Create Dashboard",
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

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    // const activeDashboardSub = this.route.params.subscribe({
    //   next: (params: Params) => {
    //     this.activeDashboardId = +params.dashboardId;
    //   },
    //   error: (error) => {
    //     console.log("error in dashboard view " + error);
    //   },
    // });

    const dashboardsSub = this.route.data.subscribe((data) => {
      if (data.dashboards && data.dashboards.error) {
        console.log("error in dashboard");
      } else if (data.dashboards) {
        this.dashboards = [...data.dashboards];
        this.rows = [...this.dashboards];
      }
    });

    this.subscription.add(dashboardsSub);
    // this.subscription.add(activeDashboardSub);
  }

  // onSelect function for data table selection
  onSelect(dashboard) {
    this.selectedDashboardId = dashboard.id;
  }

  onClick(event) {
    if (event === "delete" && this.selectedDashboardId) {
      this.dashboardService
        .deleteDashboard(this.selectedDashboardId)
        .subscribe(() => {
          this.refresh();
        });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
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
        },
        {
          name: "Organization",
          prop: "orgId",
          draggable: false,
          sortable: true,
          canAutoResize: false,
          width: 120,
        },
        {
          name: "Sharing",
          draggable: false,
          canAutoResize: false,
          width: 150,
          sortable: false,
          cellTemplate: this.sharingTemplate,
        },
      ];
    }, 0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  refresh() {
    this.dashboardService.getDashboards().subscribe({
      next: (dashboards) => {
        this.dashboards = dashboards;
        this.rows = [...this.dashboards];
      },
    });
  }
}
