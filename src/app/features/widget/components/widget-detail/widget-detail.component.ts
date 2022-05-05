import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Widget } from "@widget/models/widget";
import { Subject, Subscription, tap } from "rxjs";
import { ViewService } from "@core/services/view.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { DashboardService } from "@dashboard/services/dashboard.service";
import { Dashboard } from "@dashboard/models/dashboard";
import { WidgetDataService } from "@widget/services/widget-data.service";
import { Ability } from "@casl/ability";

@Component({
  selector: "widget-detail",
  templateUrl: "./widget-detail.component.html",
  styleUrls: ["./widget-detail.component.scss"],
  providers: [WidgetDataService],
})
export class WidgetDetailComponent implements OnInit, OnDestroy {
  @Input() widget: Widget;
  data: any;
  subscription = new Subscription();
  dataUpdate = new Subject<any>();
  loading = true;
  error: string;
  noData: boolean;
  dashboards: Dashboard[];
  // temp

  styles: any;

  constructor(
    private widgetDataService: WidgetDataService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: ConfirmDialogService,
    private dashboardService: DashboardService,
    private viewService: ViewService,
    private ability: Ability
  ) {}

  ngOnInit() {
    if (!this.widget.metrics || !this.widget.channelGroup) {
      this.error = "Widget failed to load.";
    }
    this.loading = true;
    const dataSub = this.widgetDataService.data.subscribe((data) => {
      this.noData = data && Object.keys(data).length === 0;
      this.data = data;
      this.loading = false;
    });
    this.widgetDataService.setWidget(this.widget);

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
