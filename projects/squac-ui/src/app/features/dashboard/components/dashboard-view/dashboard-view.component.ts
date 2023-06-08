import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { LoadingService } from "@core/services/loading.service";
import { DashboardService } from "squacapi";
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import { Dashboard } from "squacapi";
import { Observable } from "rxjs";
import {
  MenuAction,
  TableColumn,
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";

/**
 * Displays list of dashboards
 */
@Component({
  selector: "dashboard-view",
  templateUrl: "./dashboard-view.component.html",
  styleUrls: ["./dashboard-view.component.scss"],
})
export class DashboardViewComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  dashboards: Dashboard[] = [];
  rows: Dashboard[] = [];
  columns: TableColumn[] = [
    {
      name: "Dashboard Name",
      columnDef: "name",
    },
    { name: "Description", columnDef: "description" },
    {
      name: "Owner",
      columnDef: "owner",
    },
    {
      name: "Org.",
      columnDef: "organization",
    },
    {
      name: "Sharing",
      columnDef: "sharing",
    },
  ];

  selectedDashboardId: number;

  /** Config for detail page */
  pageOptions: PageOptions = {
    path: "/dashboards",
    titleButtons: {
      addButton: true,
    },
  };

  // table config
  options: TableOptions = {
    messages: {
      emptyMessage: "No dashboards found.",
    },
    footerLabel: "Dashboards",
  };

  // controls in table head
  controls: TableControls = {
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
  filters: TableFilters = {
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

  /**
   * subscribe to route params
   */
  ngOnInit(): void {
    const dashboardsSub = this.route.data
      .pipe(
        tap((data) => {
          // this.error = false;
          const orgId = this.route.snapshot.data["user"].orgId;
          this.queryParams = { organization: orgId };

          // default show only org
          this.dashboards = data["dashboards"].filter(
            (d: Dashboard) => d.orgId === orgId
          );
          this.rows = [...this.dashboards];
        })
      )
      .subscribe();

    this.subscription.add(dashboardsSub);
  }

  /**
   * On select from data table
   *
   * @param dashboard selected dashboard
   */
  onSelect(dashboard: Dashboard): void {
    this.selectedDashboardId = dashboard ? dashboard.id : null;
  }

  /**
   * Click event from table
   *
   * @param event menu action
   */
  onClick(event: MenuAction): void {
    if (event === "delete" && this.selectedDashboardId) {
      this.onDelete();
    }
  }

  /**
   * Deletes selected dashboard
   */
  onDelete(): void {
    this.dashboardService.delete(this.selectedDashboardId).subscribe(() => {
      this.refresh();
    });
  }

  /**
   * Fetch dashboard data
   *
   * @param refresh true if cache should not be used
   * @returns requested dashboards
   */
  fetchData(refresh?: boolean): Observable<Dashboard[]> {
    return this.dashboardService.list(this.queryParams, refresh).pipe(
      tap((dashboards: Dashboard[]) => {
        this.dashboards = [...dashboards];
        this.rows = [...this.dashboards];
      }),
      catchError(() => {
        return EMPTY;
      })
    );
  }

  /**
   * Get fresh dashboards
   *
   * @param filters search params
   */
  refresh(filters?): void {
    if (filters) {
      this.queryParams = { ...filters };
    }
    this.loadingService.doLoading(this.fetchData(true), this).subscribe();
  }

  /**
   * unsubscribe
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
