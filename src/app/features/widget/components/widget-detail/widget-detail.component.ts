import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { Widget } from "@widget/models/widget";
import { filter, Subscription, tap } from "rxjs";
import { ViewService } from "@core/services/view.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { DashboardService } from "@dashboard/services/dashboard.service";
import { Dashboard } from "@dashboard/models/dashboard";
import { WidgetDataService } from "@widget/services/widget-data.service";
import { Ability } from "@casl/ability";
import { Metric } from "@core/models/metric";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";
import { Channel } from "@core/models/channel";

@Component({
  selector: "widget-detail",
  templateUrl: "./widget-detail.component.html",
  styleUrls: ["./widget-detail.component.scss"],
  providers: [WidgetDataService],
})
export class WidgetDetailComponent implements OnInit, OnDestroy, OnChanges {
  subscription = new Subscription();
  @Input() widget: Widget;
  @ViewChild("widgetChild") widgetChild: any;
  data: any;
  dataRange: any;
  loading: boolean | string = "Requesting Data";
  error: boolean | string;
  dashboards: Dashboard[];

  channels: Channel[];

  //metric changing
  selectedMetrics: Metric[] = []; //gets send to child
  notSelected: Metric[] = [];
  selected: Metric[] = [];
  expectedMetrics: number;
  metricsChanged = false;

  dataSub: Subscription; //keep track of datasub to prevent duplicate
  styles: any;
  widgetTypes: any;
  widgetType: any;
  showStationList = false;

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

    // listen for update to widget & load new data
    const updateSub = this.viewService.updateData.subscribe({
      next: (dashboardId) => {
        if (this.widget.dashboardId === dashboardId) {
          // get new data and start timers over

          this.widgetDataService.params.next("widget detail");
        }
      },
      error: (error) => {
        console.error("error in widget detail dates: ", error);
      },
    });

    // get dashboards user is able to edit
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

    this.subscription.add(resizeSub);
    this.subscription.add(updateSub);
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
      this.dataSub = this.widgetDataService.data.subscribe((data) => {
        if (data && Object.keys(data).length === 0) {
          this.error = "No data";
          this.loading = false;
        } else {
          this.channels = this.widgetDataService.channels;
          this.dataRange = this.widgetDataService.dataRange;
          this.data = data;
          this.error = false;
        }
      });
    }
    if (!this.widget.isValid) {
      this.error = "Widget failed to load, try checking configuration.";
    } else {
      this.widgetType = this.widgetTypes.find(
        (type) => type.type === this.widget.type
      );

      this.checkDimensions();
      this.widgetDataService.updateWidget(this.widget, this.widgetType);
      this.selectMetrics();
    }
  }

  //if widget doesn't have dimensions set yet, populate them
  checkDimensions(): void {
    const dims = this.widget.properties.dimensions;
    if (!dims || (dims.length === 0 && this.widgetType.dimensions)) {
      this.widget.properties.dimensions = [];
      this.widgetType.dimensions?.forEach((dim, i) => {
        this.widget.properties.dimensions.push({
          metricId: this.widget.metrics[i].id,
          type: dim,
        });
      });
    }
  }

  // populate selected metrics
  selectMetrics(): void {
    this.selected = [];
    if (this.widget.properties.dimensions.length === 0) {
      this.selected = [...this.widget.metrics];
    } else if (this.widget.properties?.dimensions) {
      this.selected = [];
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

  // get new data and save metrics when changed
  metricsSelected(): void {
    if (
      (this.widgetType.dimensions &&
        this.selected.length >= this.widgetType.dimensions.length) ||
      (!this.widgetType.dimensions && this.selected.length > 0)
    ) {
      this.selectedMetrics = [...this.selected];
      this.metricsChanged = false;
    }
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

  // change dimension for metric
  changeMetric($event, metricIndex, selectedIndex): void {
    this.metricsChanged = true;
    $event.stopPropagation();
    if (selectedIndex === -1) {
      const newLength = this.selected.unshift(this.widget.metrics[metricIndex]);
      if (newLength > this.widget.properties?.dimensions.length) {
        this.selected.pop();
      }
    } else {
      this.selected.splice(selectedIndex, 1);
    }
  }

  getSelectedIndex(metric): number {
    return this.selected.findIndex((m) => {
      return metric.id === m.id;
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
