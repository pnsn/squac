import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import { Metric } from "squacapi";
import { MetricService } from "squacapi";
import { LoadingService } from "@core/services/loading.service";
import { Observable } from "rxjs";
import {
  TableColumn,
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";
import { PageOptions } from "@shared/components/detail-page/detail-page.interface";

/**
 * Shows list of metrics
 */
@Component({
  selector: "metric-view",
  templateUrl: "./metric-view.component.html",
})
export class MetricViewComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  metrics: Metric[];
  selectedMetricId: number = null;

  // table config
  columns: TableColumn[] = [
    {
      name: "Metric Name",
      columnDef: "name",
    },
    { name: "Default Min", columnDef: "minVal" },
    {
      name: "Default Max",
      columnDef: "maxVal",
    },
    {
      name: "Unit",
      columnDef: "unit",
    },
    {
      name: "Sample Rate",
      columnDef: "sampleRate",
    },
    {
      name: "Description",
      columnDef: "description",
    },
    {
      name: "Owner",
      columnDef: "owner",
    },
  ];

  rows: Metric[] = [];
  /** Config for detail page */
  pageOptions: PageOptions = {
    path: "/metrics",
    titleButtons: {
      addButton: true,
    },
  };
  //table options
  options: TableOptions = {
    messages: {
      emptyMessage: "No metrics found.",
    },
    autoRouteToDetail: false,
    footerLabel: "Metrics",
  };
  controls: TableControls = {
    listenToRouter: true,
    basePath: "/metrics",
    resource: "Metric",
    add: {
      text: "Add Metric",
    },
    edit: {
      text: "Edit Metric",
    },
    refresh: false,
  };
  filters: TableFilters = {
    toggleShared: false,
    searchField: {
      text: "Filter metrics...",
      props: ["owner", "orgId", "name", "description"],
    },
  };

  constructor(
    private route: ActivatedRoute,
    private metricService: MetricService,
    public loadingService: LoadingService
  ) {}

  /** subscribe to params */
  ngOnInit(): void {
    const routeSub = this.route.data
      .pipe(
        tap((data) => {
          this.metrics = data["metrics"];
          const params = this.route.snapshot.params;
          if (params["metricId"]) {
            this.selectedMetricId = +params["metricId"];
          }
        })
      )
      .subscribe({
        next: () => {
          this.rows = [...this.metrics];
        },
      });

    this.subscription.add(routeSub);
  }

  /**
   * Get new data
   *
   * @param refresh true if cache should not be used
   * @returns observable of metrics
   */
  fetchData(refresh?: boolean): Observable<Metric[]> {
    return this.loadingService.doLoading(
      this.metricService.list({}, refresh).pipe(
        tap((results) => {
          this.metrics = results;
          this.rows = [...this.metrics];
        }),
        catchError(() => {
          return EMPTY;
        })
      ),
      this
    );
  }

  /** Get fresh metrics */
  refresh(): void {
    this.fetchData(true).subscribe();
  }

  /** unsubsribe */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
