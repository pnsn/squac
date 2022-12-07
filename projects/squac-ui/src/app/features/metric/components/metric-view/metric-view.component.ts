import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
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

@Component({
  selector: "metric-view",
  templateUrl: "./metric-view.component.html",
  styleUrls: ["./metric-view.component.scss"],
})
export class MetricViewComponent implements OnInit, OnDestroy, AfterViewInit {
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

  ngOnInit(): void {
    const monitorsSub = this.route.params
      .pipe(
        tap(() => {
          // this.error = false;
        }),
        switchMap(() => {
          return this.loadingService.doLoading(this.fetchData());
        })
      )
      .subscribe();

    this.subscription.add(monitorsSub);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columns = [
        {
          name: "Name",
          draggable: false,
          sortable: true,
          width: 300,
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
    }, 0);
  }

  fetchData(refresh?: boolean): Observable<Metric[]> {
    return this.metricService.list({}, refresh).pipe(
      tap((results) => {
        this.metrics = results;
        this.rows = [...this.metrics];
      }),
      catchError(() => {
        return EMPTY;
      })
    );
  }

  // get fresh metrics
  refresh(): void {
    this.loadingService.doLoading(this.fetchData(true), this).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
