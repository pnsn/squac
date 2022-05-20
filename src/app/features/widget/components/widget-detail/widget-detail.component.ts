import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { Widget } from "@widget/models/widget";
import { Subject, Subscription, tap } from "rxjs";
import { ViewService } from "@core/services/view.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { DashboardService } from "@dashboard/services/dashboard.service";
import { Dashboard } from "@dashboard/models/dashboard";
import { WidgetDataService } from "@widget/services/widget-data.service";
import { Ability } from "@casl/ability";
import { Metric } from "@core/models/metric";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";

@Component({
  selector: "widget-detail",
  templateUrl: "./widget-detail.component.html",
  styleUrls: ["./widget-detail.component.scss"],
  providers: [WidgetDataService],
})
export class WidgetDetailComponent implements OnInit, OnDestroy, OnChanges {
  @Input() widget: Widget;
  data: any;
  dataRange: any;
  subscription = new Subscription();
  dataUpdate = new Subject<any>();
  loading = true;
  error: string;
  noData: boolean;
  dashboards: Dashboard[];
  selectedMetrics: Metric[] = [];
  selected: Metric[] = [];
  expectedMetrics: number;
  metricsChanged = false;
  // temp

  styles: any;
  widgetTypes = [
    {
      id: 1,
      name: "table",
      type: "tabular",
      useAggregate: true,
      description:
        "Table showing channels (grouped as stations) and aggregated measurement values.",
    },
    {
      id: 2,
      name: "timeline",
      type: "timeline",
      useAggregate: false,
      description:
        "Measurements during time range for one metric, displayed as rows of channels",
    },
    {
      id: 3,
      name: "time series",
      type: "timeseries",
      useAggregate: false,
      description:
        "Measurements during time range for one metric, displayed as lines of channels",
    },
    {
      id: 4,
      name: "map",
      type: "map",
      useAggregate: true,
      description:
        "Map of channels (grouped as stations) represented by the measurement value or thresholds.",
    },
    // {
    //   id: 5,
    //   name: "box plot",
    //   type: "box-plot",
    //   use_aggregate: true,
    // },
    {
      id: 6,
      name: "parallel plot",
      type: "parallel-plot",
      useAggregate: true,
      description:
        "Aggregated measurements for multiple metrics, displayed as lines of channels on multiple axes.",
    },
    {
      id: 7,
      name: "scatter plot",
      type: "scatter-plot",
      useAggregate: true,
      description: "Measurements for 3 metrics displayed as a scatter plot.",
    },
  ];

  constructor(
    private widgetDataService: WidgetDataService,
    private widgetConfigService: WidgetConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    private dashboardService: DashboardService,
    private viewService: ViewService,
    private ability: Ability
  ) {
    this.widgetTypes = this.widgetConfigService.widgetTypes;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.widget) {
      this.initWidget();
    }
  }
  ngOnInit() {
    this.loading = true;
    const dataSub = this.widgetDataService.data.subscribe((data) => {
      this.noData = data && Object.keys(data).length === 0;
      this.dataRange = this.widgetDataService.dataRange;
      this.data = data;
      this.loading = false;
    });

    const datesSub = this.viewService.updateData.subscribe({
      next: (dashboardId) => {
        this.data = {};
        if (this.widget.dashboardId === dashboardId) {
          this.loading = true;
          // get new data and start timers over
          this.getData();
        }
      },
      error: (error) => {
        console.log("error in widget detail dates: " + error);
      },
    });

    this.dashboardService
      .getDashboards()
      .pipe(
        tap((dashboards) => {
          this.dashboards = dashboards.filter((d) => {
            return this.ability.can("update", d);
          });
        })
      )
      .subscribe((dashboards) => {
        this.dashboards = dashboards;
      });

    this.subscription.add(datesSub);

    this.subscription.add(dataSub);
    // widget data errors here
  }

  initWidget() {
    this.loading = true;
    if (!this.widget.metrics || !this.widget.channelGroup) {
      this.error = "Widget failed to load.";
    }
    this.widgetDataService.setWidget(this.widget);
    /// set type;
    const type = this.widgetTypes.find(
      (type) => type.type === this.widget.type
    );
    console.log(type, this.widget.type);
    this.widgetDataService.setType(type);
    this.getData();
    this.selectMetrics();
  }

  //todo this should be in child component, avoid type specific in detail
  selectMetrics() {
    if (this.widget.type === "scatter-plot") {
      this.expectedMetrics = 3;
      this.selected = this.widget.metrics.slice(0, this.expectedMetrics);
    } else if (
      this.widget.type === "parallel-plot" ||
      this.widget.type === "tabular"
    ) {
      this.selected = [...this.widget.metrics];
    } else {
      this.expectedMetrics = 1;
      this.selected = [this.widget.metrics[0]];
    }
    this.metricsSelected();
  }

  metricsSelected() {
    this.selectedMetrics = [...this.selected];
    this.metricsChanged = false;
  }
  selectMetric($event, metric) {
    this.metricsChanged = true;
    $event.stopPropagation();
    const index = this.getIndex(metric);
    if (index > -1) {
      this.selected.splice(index, 1);
    } else {
      if (this.selected.length === this.expectedMetrics) {
        this.selected.pop();
      }
      this.selected.push(metric);
    }
  }

  getIndex(metric): number {
    return this.selected.findIndex((m) => {
      return metric.id === m.id;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  refreshWidget() {
    this.getData();
  }

  private getData() {
    this.widgetDataService.fetchMeasurements();
  }

  addWidgetToDashboard(dashboardId) {
    // select dashboard
    // navigate to dashboard
    this.router.navigate([
      "dashboards",
      dashboardId,
      "widgets",
      this.widget.id,
      "edit",
    ]);
  }

  editWidget() {
    this.router.navigate([this.widget.id, "edit"], { relativeTo: this.route });
  }

  deleteWidget() {
    this.confirmDialog.open({
      title: `Delete: ${this.widget.name}`,
      message: "Are you sure? This action is permanent.",
      cancelText: "Cancel",
      confirmText: "Delete",
    });
    this.confirmDialog.confirmed().subscribe((confirm) => {
      if (confirm) {
        this.viewService.deleteWidget(this.widget.id);
      }
    });
  }
}
