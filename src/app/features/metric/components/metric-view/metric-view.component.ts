import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Metric } from "@core/models/metric";
import { ColumnMode, SelectionType } from "@swimlane/ngx-datatable";

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

  constructor(private route: ActivatedRoute) {}
  options = {
    messages: {
      emptyMessage: "No metrics found.",
    },
    selectionType: "single",
    autoRouteToDetail: false,
    footerLabel: "Metrics",
  };
  controls = {
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
    toggleShared: true,
    searchField: {
      text: "Type to filter...",
      props: ["owner", "orgId", "name", "description"],
    },
  };
  ngOnInit() {
    if (this.route.parent) {
      this.metrics = this.route.parent.snapshot.data.metrics;
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

  onSelect($event) {
    console.log($event);
  }
}
