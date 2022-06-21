import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Metric } from "@core/models/metric";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";
import { MetricService } from "@features/metric/services/metric.service";

@Component({
  selector: "metric-view",
  templateUrl: "./metric-view.component.html",
  styleUrls: ["./metric-view.component.scss"],
})
export class MetricViewComponent implements OnInit, OnDestroy, AfterViewInit {
  metrics: Metric[];
  subscription: Subscription = new Subscription();
  selectedMetric: Metric;
  selected = false;
  columns = [];
  rows = [];
  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

  constructor(
    private route: ActivatedRoute,
    private metricService: MetricService
  ) {}
  options = {
    messages: {
      emptyMessage: "No metrics found.",
    },
    selectionType: "single",
    autoRouteToDetail: false,
    footerLabel: "Metrics",
  };
  controls = {
    listenToRouterEvents: true,
    basePath: "/metrics",
    resource: "Metric",
    add: {
      text: "Add Metric",
    },
    actionMenu: {},
    edit: {
      text: "Edit Metric",
    },
    refresh: false,
  };
  filters = {
    toggleShared: false,
    searchField: {
      text: "Type to filter...",
      props: ["owner", "orgId", "name", "description"],
    },
  };

  ngOnInit() {
    if (this.route && this.route.snapshot) {
      this.metrics = this.route.snapshot.data.metrics;
      this.rows = [...this.metrics];
    }
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
      ];
    }, 0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  refresh() {
    this.metricService.getMetrics().subscribe((metrics) => {
      this.metrics = metrics;
      this.rows = [...this.rows];
    });
  }
  // onSelect function for data table selection
  // onSelect(selectedRow) {
  //   this.selectedRowId = selectedRow.id;
  // }

  // onClick(event) {
  //   if (event === "delete" && this.selectedRowId) {
  //     this.metricsService
  //       .deleteDashboard(this.selectedRowId)
  //       .subscribe(() => {
  //         this.refresh();
  //       });
  //   }
  // }
}
