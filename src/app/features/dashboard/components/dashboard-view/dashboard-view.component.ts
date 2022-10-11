import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  TemplateRef,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { DashboardService } from "@features/dashboard/services/dashboard.service";
import { catchError, EMPTY, Subscription, switchMap, tap } from "rxjs";
import { Dashboard } from "../../models/dashboard";

// List of dashboards
@Component({
  selector: "dashboard-view",
  templateUrl: "./dashboard-view.component.html",
  styleUrls: ["./dashboard-view.component.scss"],
})
export class DashboardViewComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  subscription: Subscription = new Subscription();
  @ViewChild("sharingTemplate") sharingTemplate: TemplateRef<any>;
  @ViewChild("nameTemplate") nameTemplate: TemplateRef<any>;

  dashboards: Dashboard[] = [];
  rows: Dashboard[] = [];
  columns = [];
  selectedDashboardId: number;

  // table config
  options = {
    messages: {
      emptyMessage: "No dashboards found.",
    },
    footerLabel: "Dashboards",
    selectionType: "single",
  };

  // controls in table head
  controls = {
    listenToRouter: true,
    basePath: "/dashboards",
    resource: "Dashboard",
    add: {
      text: "Add Dashboard",
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

  // search filters
  filters = {
    toggleShared: true,
    searchField: {
      text: "Filter dashboards...",
      props: ["owner", "orgId", "name", "description"],
    },
  };

  queryParams: Params;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const dashboardsSub = this.route.params
      .pipe(
        tap(() => {
          // this.error = false;
          const orgId = this.route.snapshot.data.user.orgId;
          this.queryParams = { organization: orgId };
        }),
        switchMap(() => {
          return this.loadingService.doLoading(this.fetchData());
        })
      )
      .subscribe();

    this.subscription.add(dashboardsSub);
  }

  ngAfterViewInit(): void {
    // set up columns
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

  // onSelect function for data table selection
  onSelect(dashboard): void {
    console.log(dashboard);
    this.selectedDashboardId = dashboard.id;
  }

  // click event from table
  onClick(event): void {
    if (event === "delete" && this.selectedDashboardId) {
      this.onDelete();
    }
  }

  // delete dashboard
  onDelete(): void {
    this.dashboardService.delete(this.selectedDashboardId).subscribe(() => {
      this.refresh();
    });
  }

  fetchData() {
    return this.dashboardService.list(this.queryParams).pipe(
      tap((dashboards) => {
        this.dashboards = [...dashboards];
        this.rows = [...this.dashboards];
      }),
      catchError(() => {
        return EMPTY;
      })
    );
  }

  // get fresh dashboards
  refresh(filters?): void {
    this.queryParams = { ...filters };
    this.loadingService.doLoading(this.fetchData(), this).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
