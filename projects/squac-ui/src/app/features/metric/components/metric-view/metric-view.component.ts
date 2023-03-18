import { Component, OnInit, OnDestroy, AfterContentInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { catchError, EMPTY, Subscription, switchMap, tap } from "rxjs";
import { Metric } from "squacapi";
import { MetricService } from "squacapi";
import { LoadingService } from "@core/services/loading.service";
import { Observable } from "rxjs";
import {
  TableControls,
  TableFilters,
  TableOptions,
} from "@shared/components/table-view/interfaces";

/**
 * Shows list of metrics
 */
@Component({
  selector: "metric-view",
  templateUrl: "./metric-view.component.html",
  styleUrls: ["./metric-view.component.scss"],
})
export class MetricViewComponent
  implements OnInit, OnDestroy, AfterContentInit
{
  subscription: Subscription = new Subscription();
  metrics: Metric[];

  // table config
  columns = [];
  rows = [];

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
    const monitorsSub = this.route.params
      .pipe(
        switchMap(() => {
          return this.fetchData();
        })
      )
      .subscribe();

    this.subscription.add(monitorsSub);
  }

  /** init columns */
  ngAfterContentInit(): void {
    this.columns = [
      {
        name: "Name",
        draggable: false,
        sortable: true,
        width: 150,
        canAutoResize: false,
      },
      {
        name: "Default Min",
        prop: "minVal",
        draggable: false,
        canAutoResize: false,
        sortable: true,
        width: 115,
      },
      {
        name: "Default Max",
        prop: "maxVal",
        canAutoResize: false,
        draggable: false,
        sortable: true,
        width: 115,
      },
      {
        name: "Unit",
        canAutoResize: false,
        draggable: false,
        sortable: true,
        width: 115,
      },
      {
        name: "Sample Rate",
        prop: "sampleRate",
        canAutoResize: false,
        draggable: false,
        sortable: true,
        width: 115,
      },
      {
        name: "Description",
        draggable: false,
        sortable: true,
      },
      {
        name: "Owner",
        prop: "owner",
        canAutoResize: false,
        draggable: false,
        sortable: true,
        width: 120,
      },
    ];
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
