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
  selectedMetrics: Metric[] = []; //gets send to child
  notSelected: Metric[] = [];
  selected: Metric[] = [];
  expectedMetrics: number;
  metricsChanged = false;
  // temp

  dataSub: Subscription;
  styles: any;
  widgetTypes;
  widgetType;

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
    const updateSub = this.viewService.updateData.subscribe({
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

    this.subscription.add(updateSub);

    this.subscription.add(this.dataSub);
  }

  initWidget() {
    this.loading = true;

    if (!this.dataSub) {
      this.dataSub = this.widgetDataService.data.subscribe((data) => {
        this.noData = data && Object.keys(data).length === 0;
        this.dataRange = this.widgetDataService.dataRange;
        this.data = data;
        this.loading = false;
      });
    }

    if (!this.widget.isValid) {
      this.error = "Widget failed to load, try checking configuration.";
    } else {
      this.widgetDataService.setWidget(this.widget);
      /// set type;
      this.widgetType = this.widgetTypes.find(
        (type) => type.type === this.widget.type
      );
      this.widgetDataService.setType(this.widgetType);
      this.checkDimensions();
      this.selectMetrics();

      this.getData();
    }
  }

  //if widget doesn't have dimensions set yet, populate them
  checkDimensions() {
    const dims = this.widget.properties.dimensions;
    if (!dims || (dims.length === 0 && this.widgetType.dimensions)) {
      this.widget.properties.dimensions = [];
      this.widgetType.dimensions?.forEach((dim, i) => {
        this.widget.properties.dimensions.push({
          metricId: this.widget.metrics[i].id,
          type: dim,
        });
      });
      // this.widget.properties.dimensions
    }
  }

  getMetricDim(i) {
    return this.widget.metrics[i].name;
  }

  inDimensions(metric): string {
    const dims = this.widget.properties?.dimensions;

    if (dims) {
      const dim = dims.find((d) => {
        return d.metricId === metric.id;
      });
      return dim ? dim.type : "";
    }
    return "";
  }

  selectMetrics() {
    this.selected = [];
    if (!this.widgetType.dimensions) {
      this.selected = [...this.widget.metrics];
    } else if (this.widget.properties?.dimensions) {
      this.widget.properties.dimensions.forEach((dim) => {
        const metric = this.widget.metrics.find((m) => m.id === dim.metricId);
        if (metric) {
          this.selected.push(metric);
        } else {
          this.selected.push(this.widget.metrics[0]);
        }
      });
    }
    this.metricsSelected();
  }

  metricsSelected() {
    this.selectedMetrics = [...this.selected];
    this.metricsChanged = false;
  }

  changeMetric($event, metric, i) {
    this.metricsChanged = true;
    $event.stopPropagation();
    if (i > -1) {
      this.selected.splice(i, 1);
      this.notSelected.push(metric);
    }
  }

  addMetric($event, metric, i) {
    this.metricsChanged = true;
    $event.stopPropagation();
    if (this.selected.length === this.expectedMetrics) {
      this.selected.pop();
    }
    this.selected.push(metric);
    this.notSelected.splice(i, 1);
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
