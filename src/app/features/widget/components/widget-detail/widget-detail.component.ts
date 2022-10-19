import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { Widget } from "@squacapi/models/widget";
import { filter, Subscription } from "rxjs";
import { ViewService } from "@core/services/view.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { Dashboard } from "@squacapi/models/dashboard";
import { WidgetDataService } from "../../services/widget-data.service";
import { Metric } from "@squacapi/models/metric";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";
import { Channel } from "@squacapi/models/channel";
import { Threshold } from "@squacapi/models/threshold";
import { LoadingService } from "@core/services/loading.service";
import {
  WidgetDisplayOption,
  WidgetType,
} from "@features/widget/models/widget-type";

@Component({
  selector: "widget-detail",
  templateUrl: "./widget-detail.component.html",
  styleUrls: ["./widget-detail.component.scss"],
  providers: [WidgetDataService],
})
export class WidgetDetailComponent implements OnInit, OnDestroy, OnChanges {
  subscription = new Subscription();
  @Input() widget: Widget;
  @Input() dashboards: Dashboard[];
  @ViewChild("widgetChild") widgetChild: any;
  data: any;
  dataRange: any;
  error: boolean | string;

  channels: Channel[];
  zooming: false;
  //metric changing
  selectedMetrics: Metric[] = []; //gets send to child
  notSelected: Metric[] = [];
  selected: number[] = [];
  expectedMetrics: number;
  metricsChanged = false;
  availableDimensions = [];
  dataSub: Subscription; //keep track of datasub to prevent duplicate
  styles: any;
  widgetType: WidgetType;
  displayType: WidgetDisplayOption;
  showKey = true;
  constructor(
    private widgetDataService: WidgetDataService,
    private widgetConfigService: WidgetConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    private viewService: ViewService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    // listen to resize
    const resizeSub = this.viewService.resize
      .pipe(filter((id) => this.widget.id === id))
      .subscribe({
        next: () => {
          if (
            this.widgetChild &&
            typeof this.widgetChild.resize === "function"
          ) {
            //check if widget has resize function then call it
            this.widgetChild.resize();
          }
        },
      });

    const channelsSub = this.viewService.channels.subscribe((channels) => {
      this.error =
        channels?.length === 0 ? "Error: No channels selected." : null;
    });

    this.subscription.add(channelsSub);
    this.subscription.add(resizeSub);
    this.subscription.add(this.dataSub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.widget) {
      this.initWidget();
    }
  }

  // set up widget
  initWidget(): void {
    if (!this.dataSub) {
      this.dataSub = this.widgetDataService.data.subscribe((data: any) => {
        this.channels = this.viewService.channels.getValue();
        if (!data) {
          this.error = "No data.";
        } else if (data.error) {
          this.error = data.error;
        } else if (
          this.widgetDataService.measurementsWithData.length <
          this.widgetType.minMetrics
        ) {
          this.error = "No measurements found for one or more metrics.";
        } else {
          this.dataRange = this.widgetDataService.dataRange;
          this.data = data;
          this.error = false;
        }
      });
    }
    if (!this.widget.isValid) {
      this.error = "Widget failed to load, try checking configuration.";
    } else {
      this.widgetType = this.widgetConfigService.getWidgetType(
        this.widget.type
      );

      this.displayType = this.widgetType.getOption(
        this.widget.properties.displayType
      );

      // check if has required # of metrics
      if (
        !this.widget.metrics ||
        this.widgetType.minMetrics > this.widget.metrics.length
      ) {
        this.error = `Error: ${this.widget.metrics.length} of ${this.widgetType.minMetrics} metrics selected.`;
      } else {
        this.widgetDataService.updateWidget(this.widget, this.widgetType);
        this.selectMetrics();
        console.log("update data in widget");
        // this.viewService.updateData.next({ widget: this.widget.id });
      }
    }
  }

  // populate selected metrics
  selectMetrics(): void {
    this.selected = [];

    if (this.displayType?.dimensions) {
      this.availableDimensions = [...this.displayType.dimensions];

      // get metrics that match thresholds & check dimensions
      for (let i = 0; i < this.widget.thresholds.length; i++) {
        const threshold = this.widget.thresholds[i];
        if (threshold.dimension) {
          const metricIndex = this.widget.metrics.findIndex(
            (m) => m.id === threshold.metricId
          );
          if (metricIndex === -1) {
            //check if widget has metric
            this.widget.thresholds.splice(i, 1);
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
      if (this.selected.length < this.widgetType.minMetrics) {
        this.widget.metrics.forEach((metric: Metric, _index) => {
          if (
            this.selected.indexOf(metric.id) < 0 &&
            this.availableDimensions.length > 0
          ) {
            this.widget.thresholds.push({
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
      this.selected = this.widget.metrics.map((metric) => metric.id);
    }

    this.metricsSelected();
  }

  // get new data and save metrics when changed
  metricsSelected(): void {
    if (this.widget.metrics && this.widgetType.minMetrics) {
      while (this.selected.length < this.widgetType.minMetrics) {
        this.selected.push(this.widget.metrics[0].id);
      }
      const diff = this.widgetType.minMetrics - this.selected.length;
      //if not enough metrics, populate with 1st one to prevent breaking
      this.selected.fill(
        this.widget.metrics[0].id,
        this.selected.length - 1,
        diff + this.selected.length - 1
      );
    }

    // add all selected metrics
    if (
      this.selected.length >= this.widgetType.minMetrics ||
      (!this.displayType.dimensions && this.selected.length > 0)
    ) {
      // this.selectedMetrics = this.widget.metrics.filter(
      //   (metric) => this.selected.indexOf(metric.id) > -1
      // );

      this.selectedMetrics = this.selected.map((metricId) => {
        return this.widget.metrics.find((m) => m.id === metricId);
      });
      this.metricsChanged = false;
    }
    //order is getting reset by this
    // get new data
    this.widgetDataService.updateMetrics(this.selectedMetrics);
  }

  startZoom() {
    this.widgetChild.startZoom();
    try {
      this.widgetChild.startZoom();
    } catch {
      console.log("resized");
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
        this.widget.thresholds.forEach((t) => {
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
    return this.widget.metrics.find((m) => {
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
