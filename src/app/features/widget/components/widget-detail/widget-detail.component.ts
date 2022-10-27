import {
  Component,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ViewChild,
  OnInit,
} from "@angular/core";
import { Widget } from "@squacapi/models/widget";
import { filter, Subscription, tap } from "rxjs";
import { ViewService } from "@core/services/view.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { Dashboard } from "@squacapi/models/dashboard";
import { WidgetDataService } from "../../services/widget-data.service";
import { Metric } from "@squacapi/models/metric";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";
import { Threshold } from "@squacapi/models/threshold";
import { LoadingService } from "@core/services/loading.service";
import {
  WidgetDisplayOption,
  WidgetType,
} from "@features/widget/models/widget-type";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";

@Component({
  selector: "widget-detail",
  templateUrl: "./widget-detail.component.html",
  styleUrls: ["./widget-detail.component.scss"],
  providers: [WidgetManagerService, WidgetDataService],
})
export class WidgetDetailComponent implements OnDestroy, OnChanges, OnInit {
  subscription = new Subscription();
  @Input() widget: Widget;
  @Input() dashboards: Dashboard[];

  error: boolean | string;

  notSelected: Metric[] = [];
  selected: number[] = [];
  expectedMetrics: number;
  metricsChanged = false;
  availableDimensions = [];

  initialMetrics: Metric[];
  thresholds: Threshold[];

  widgetType: WidgetType;
  displayType: WidgetDisplayOption;
  @ViewChild("widgetChild") widgetChild: any;

  zooming: string;
  showKey = true;
  constructor(
    private widgetManager: WidgetManagerService,
    private widgetConfigService: WidgetConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    private viewService: ViewService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const updateSub = this.viewService.updateData
      .pipe(
        filter((data: any) => {
          return (
            this.widget &&
            ((data.dashboard && data.dashboard === this.widget.dashboardId) ||
              (data.widget && data.widget === this.widget.id))
          );
        }),
        tap(() => {
          const group = this.viewService.channelGroupId.getValue();
          const channels = this.viewService.channels.getValue();

          this.widgetManager.updateTimes(
            this.viewService.startTime,
            this.viewService.endTime
          );
          this.widgetManager.updateStat(
            this.widget.stat || this.viewService.archiveStat,
            this.viewService.archiveType
          );
          this.widgetManager.updateChannels(group, channels);
        })
      )
      .subscribe();

    this.widgetManager.widget.subscribe((widget: Widget) => {
      this.initWidget(widget);
    });

    this.widgetManager.zoomStatus.subscribe((status) => {
      this.zooming = status;
    });
    this.widgetManager.toggleKey.subscribe((show) => {
      this.showKey = show;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.widget) {
      this.widgetManager.initWidget(this.widget);
    }
  }

  // set up widget after it's validated
  initWidget(widget): void {
    // widget manager will check if valid
    this.widgetType = this.widgetConfigService.getWidgetType(widget.type);
    this.widgetManager.widgetType = this.widgetType;
    this.displayType = this.widgetManager.widgetDisplayOption;
    this.expectedMetrics = this.widgetManager.widgetType.minMetrics;
    this.initialMetrics = widget.metrics.slice();
    this.thresholds = widget.thresholds.slice();

    this.selectMetrics();
  }

  // populate selected metrics
  selectMetrics(): void {
    this.selected = [];

    if (this.displayType?.dimensions) {
      this.availableDimensions = [...this.displayType.dimensions];

      // get metrics that match thresholds & check dimensions
      for (let i = 0; i < this.thresholds.length; i++) {
        const threshold = this.thresholds[i];
        if (threshold.dimension) {
          const metricIndex = this.initialMetrics.findIndex(
            (m) => m.id === threshold.metricId
          );
          if (metricIndex === -1) {
            //check if widget has metric
            this.thresholds.splice(i, 1);
          } else {
            this.selected.push(threshold.metricId);
            const index = this.availableDimensions.indexOf(threshold.dimension);
            if (index > -1) {
              this.availableDimensions.splice(index, 1);
            } else {
              threshold.dimension = null;
            }
          }
        }
      }

      // if enough not enough dimensions, update with remaining metrics
      if (this.selected.length < this.expectedMetrics) {
        this.initialMetrics.forEach((metric: Metric, _index) => {
          if (
            this.selected.indexOf(metric.id) < 0 &&
            this.availableDimensions.length > 0
          ) {
            this.thresholds.push({
              metricId: metric.id,
              min: metric.minVal,
              max: metric.maxVal,
              dimension: this.availableDimensions[0],
            });
            this.selected.push(metric.id);
            this.availableDimensions.splice(0, 1);
          }
        });
      }
    } else {
      // for widgets with no dimensions, show all as selected;
      this.selected = this.initialMetrics.map((metric) => metric.id);
    }

    this.metricsSelected();
  }

  // get new data and save metrics when changed
  metricsSelected(): void {
    let selectedMetrics = [];
    if (this.initialMetrics && this.expectedMetrics) {
      while (this.selected.length < this.expectedMetrics) {
        this.selected.push(this.initialMetrics[0].id);
      }
      const diff = this.expectedMetrics - this.selected.length;
      //if not enough metrics, populate with 1st one to prevent breaking
      this.selected.fill(
        this.initialMetrics[0].id,
        this.selected.length - 1,
        diff + this.selected.length - 1
      );
    }

    // add all selected metrics
    if (
      this.selected.length >= this.expectedMetrics ||
      (!this.displayType.dimensions && this.selected.length > 0)
    ) {
      // this.selectedMetrics = this.initialMetrics.filter(
      //   (metric) => this.selected.indexOf(metric.id) > -1
      // );

      selectedMetrics = this.selected.map((metricId) => {
        return this.initialMetrics.find((m) => m.id === metricId);
      });
      this.metricsChanged = false;
    }
    //order is getting reset by this
    // get new data
    this.widgetManager.updateThresholds(this.thresholds);
    this.widgetManager.updateMetrics(selectedMetrics);
  }
  toggleKey() {
    this.widgetManager.toggleKey.next(!this.showKey);
  }

  updateZoom(status?: string) {
    if (status) {
      this.widgetManager.zoomStatus.next(status);
    } else if (this.zooming === "start") {
      this.widgetManager.zoomStatus.next("stop");
    } else {
      this.widgetManager.zoomStatus.next("start");
    }
  }

  //97: decrequest
  //94 hourly bp
  //83 hourly max

  //x-axis, y-axis, color

  // change dimension for metric
  changeThreshold(
    $event,
    threshold: Threshold,
    selectedIndex: number,
    metric
  ): void {
    this.metricsChanged = true;
    $event.stopPropagation();
    if (selectedIndex === -1) {
      //not currently selected;
      if (
        this.availableDimensions.length === 0 &&
        this.displayType?.dimensions
      ) {
        //remove dimension from other metrics
        threshold.dimension = this.displayType.dimensions[0];
        this.thresholds.forEach((t) => {
          if (
            t.dimension === threshold.dimension &&
            t.metricId !== threshold.metricId
          ) {
            t.dimension = null;
            const index = this.selected.indexOf(t.metricId);
            this.selected[index] = threshold.metricId;
          }
        });
      } else if (this.displayType?.dimensions) {
        // put in correct spot
        threshold.dimension = this.availableDimensions[0];
        this.availableDimensions.splice(0, 1);

        this.displayType.dimensions.forEach((dim, i) => {
          if (dim === threshold.dimension) {
            this.selected[i] = threshold.metricId;
          }
        });
      } else {
        //put in first available spot
        let metricSet = false;
        this.selected = this.selected.map((s) => {
          if (s || metricSet) {
            return s;
          } else if (!metricSet && !s) {
            metricSet = true;
            return metric.id;
          }
        });
      }
    } else {
      // already selected, remove dimension
      if (this.displayType?.dimensions) {
        const dim = threshold.dimension;
        threshold.dimension = null;
        this.availableDimensions.push(dim);
      }
      this.selected[selectedIndex] = null;
    }
  }

  getSelectedIndex(id: number): number {
    return this.selected.indexOf(id);
  }
  getMetric(id: number): Metric {
    return this.initialMetrics.find((m) => {
      return m.id === id;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Route to widget edit for given dashboard
  addWidgetToDashboard(dashboardId: number): void {
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

  // route to edit
  editWidget(): void {
    this.router.navigate([this.widget.id, "edit"], { relativeTo: this.route });
  }

  // confirm & delete widget
  deleteWidget(): void {
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
