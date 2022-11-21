import {
  Component,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ViewChild,
  OnInit,
} from "@angular/core";
import { Dashboard, Metric } from "squacapi";
import { filter, Subscription, tap } from "rxjs";
import { ViewService } from "@dashboard/services/view.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { WidgetDataService, WidgetManagerService } from "widgets";
import { Threshold } from "squacapi";
import { WidgetDisplayOption, WidgetConfig, Widget } from "widgets";

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

  selected: number[] = [];
  expectedMetrics: number;
  availableDimensions = [];

  initialMetrics: Metric[];
  thresholds: Threshold[];

  widgetType: WidgetConfig;
  displayType: WidgetDisplayOption;
  @ViewChild("widgetChild") widgetChild: any;

  zooming: string;
  showKey = true;
  constructor(
    protected widgetManager: WidgetManagerService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    private viewService: ViewService
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

          this.widgetManager.updateStat(
            this.widget.stat || this.viewService.archiveStat,
            this.viewService.archiveType
          );
          this.widgetManager.updateTimes(
            this.viewService.startTime,
            this.viewService.endTime
          );
          this.widgetManager.updateChannels(group, channels);
          this.widgetManager.fetchData();
        })
      )
      .subscribe();

    this.widgetManager.widget.subscribe((widget: Widget) => {
      this.initWidget(widget);
    });

    this.widgetManager.zoomStatus$.subscribe((status) => {
      this.zooming = status;
    });
    this.widgetManager.toggleKey.subscribe((show) => {
      this.showKey = show;
    });

    const resizeSub = this.viewService.resize
      .pipe(filter((id) => this.widget && this.widget.id === id))
      .subscribe(() => {
        this.widgetManager.resize$.next(true);
      });

    this.subscription.add(resizeSub);

    this.subscription.add(updateSub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.widget) {
      this.widgetManager.initWidget(this.widget);
    }
  }

  // set up widget after it's validated
  initWidget(widget): void {
    // widget manager will check if valid
    this.widgetType = this.widgetManager.widgetConfig;
    this.displayType = this.widgetManager.widgetDisplayOption;
    this.expectedMetrics = this.widgetType.minMetrics;
    this.initialMetrics = widget.metrics.slice();
    this.thresholds = widget.thresholds.slice();
  }

  metricsChanged(metrics: Metric[]) {
    this.widgetManager.updateThresholds(this.thresholds);
    this.widgetManager.updateMetrics(metrics);
    this.widget.thresholds = this.thresholds;
    this.viewService.saveWidget(this.widget, true);
  }

  toggleKey() {
    this.widgetManager.toggleKey.next(!this.showKey);
  }

  updateZoom(status?: string) {
    if (status) {
      this.widgetManager.zoomStatus$.next(status);
    } else if (this.zooming === "start") {
      this.widgetManager.zoomStatus$.next("stop");
    } else {
      this.widgetManager.zoomStatus$.next("start");
    }
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
