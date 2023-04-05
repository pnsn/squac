import {
  Component,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
} from "@angular/core";
import { Dashboard, Metric } from "squacapi";
import { filter, Subscription, tap } from "rxjs";
import { ViewService } from "@dashboard/services/view.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import {
  WidgetConnectService,
  WidgetDataService,
  WidgetManagerService,
} from "widgets";
import { Threshold } from "squacapi";
import { WidgetDisplayOption, WidgetConfig, Widget } from "widgets";

/**
 * Component for displaying a single widget
 */
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
  @Input() canUpdate: boolean;
  error: boolean | string;

  selected: number[] = [];
  expectedMetrics: number;
  availableDimensions = [];

  initialMetrics: Metric[];
  thresholds: Threshold[];

  widgetType: WidgetConfig;
  displayType: WidgetDisplayOption;
  @ViewChild("widgetChild") widgetChild: any;

  hideControls: boolean;
  zooming: string;
  showKey = true;
  firstMetricUpdate = true; //don't save metrics after initial update
  constructor(
    protected widgetManager: WidgetManagerService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    private viewService: ViewService,
    private widgetConnectService: WidgetConnectService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Sets up widget subscriptions
   */
  ngOnInit(): void {
    // listen for changes to data
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
          // update values
          const group = this.viewService.channelGroupId.getValue();
          const channels = this.viewService.channels.getValue();
          this.widgetManager.updateStat(
            this.viewService.archiveStat || this.widget.stat,
            this.viewService.archiveType
          );
          this.widgetManager.updateTimes(
            this.viewService.startTime,
            this.viewService.endTime
          );

          this.widgetManager.updateChannels(group, channels);
          this.cdr.detectChanges();
          this.widgetManager.fetchData();
        })
      )
      .subscribe();

    const denseViewSub = this.widgetConnectService.useDenseView.subscribe(
      (useDenseView: boolean) => {
        this.hideControls = useDenseView;
      }
    );
    // listen to widget changes
    const widgetSub = this.widgetManager.widget$.subscribe((widget: Widget) => {
      this.initWidget(widget);
    });

    // listen to zoom changes
    const zoomSub = this.widgetManager.zoomStatus$.subscribe((status) => {
      this.zooming = status;
    });

    // listen to toggle key changes
    const toggleSub = this.widgetManager.toggleKey$.subscribe((show) => {
      this.showKey = show;
    });

    // listen to resize changes
    const resizeSub = this.viewService.resize
      .pipe(filter((id) => this.widget && this.widget.id === id))
      .subscribe(() => {
        this.widgetManager.resize$.next(true);
      });

    this.subscription.add(denseViewSub);
    this.subscription.add(resizeSub);
    this.subscription.add(zoomSub);
    this.subscription.add(toggleSub);
    this.subscription.add(widgetSub);
    this.subscription.add(updateSub);
  }

  /**
   * Listen to input changes in widget and update
   *
   * @param changes input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["widget"]) {
      this.widgetManager.initWidget(this.widget);
    }
  }

  /**
   * Set up widget after it has been validated
   *
   * @param widget widget to add
   */
  initWidget(widget: Widget): void {
    // widget manager will check if valid
    this.widgetType = this.widgetManager.widgetConfig;
    this.displayType = this.widgetManager.widgetDisplayOption;
    this.expectedMetrics = this.widgetType.minMetrics;
    this.initialMetrics = widget.metrics.slice();
    this.thresholds = widget.thresholds.slice();
    if ("showLegend" in this.widget.properties) {
      this.showKey = this.widget.properties.showLegend;
      this.widgetManager.toggleKey$.next(this.showKey);
    }
  }

  /**
   * Send values to widget manager after metric changes
   *
   * @param metrics changed metrics
   */
  metricsChanged(metrics: Metric[]): void {
    this.widgetManager.updateThresholds(this.thresholds);
    this.widgetManager.updateMetrics(metrics);
    this.widget.thresholds = this.thresholds;
    if (!this.firstMetricUpdate) {
      this.viewService.saveWidget(this.widget, ["thresholds", "metrics"], true);
    }
    this.firstMetricUpdate = false;
  }

  /**
   * Toggle key event
   */
  toggleKey(): void {
    this.widgetManager.toggleKey$.next(!this.showKey);
    this.widget.properties.showLegend = this.showKey;
    this.viewService.saveWidget(this.widget, ["properties"], true);
  }

  /**
   * Emit zoom change event
   *
   * @param status zoom status
   */
  updateZoom(status?: string): void {
    if (status) {
      this.widgetManager.zoomStatus$.next(status);
    } else if (this.zooming === "start") {
      this.widgetManager.zoomStatus$.next("stop");
    } else {
      this.widgetManager.zoomStatus$.next("start");
    }
  }

  /**
   * unsubscribe on destroy
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Route to widget add for given dashboard
   *
   * @param dashboardId dashboard id
   */
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

  /**
   * Navigate to edit widget
   */
  editWidget(): void {
    this.router.navigate([this.widget.id, "edit"], { relativeTo: this.route });
  }

  /**
   * Confirm widget and delete
   */
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
