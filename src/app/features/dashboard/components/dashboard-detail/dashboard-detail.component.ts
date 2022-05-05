import { Component, OnInit, OnDestroy } from "@angular/core";
import { Dashboard } from "../../models/dashboard";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ViewService } from "@core/services/view.service";
import { AppAbility } from "@core/utils/ability";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";

//
@Component({
  selector: "dashboard-detail",
  templateUrl: "./dashboard-detail.component.html",
  styleUrls: ["./dashboard-detail.component.scss"],
})
export class DashboardDetailComponent implements OnInit, OnDestroy {
  dashboard: Dashboard;
  subscription: Subscription = new Subscription();
  status;

  error: string = null;
  unsaved = false;
  archiveType: string;
  archiveStat: string;

  dataParamsChanged = false;

  datePickerTimeRanges = [
    {
      amount: "15",
      unit: "minutes",
    },
    {
      amount: "30",
      unit: "minutes",
    },
    {
      amount: "1",
      unit: "hour",
    },
    {
      amount: "12",
      unit: "hours",
    },
    {
      amount: "1",
      unit: "day",
    },
    {
      amount: "1",
      unit: "week",
    },
    {
      amount: "4",
      unit: "week",
    },
  ];

  liveMode;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewService: ViewService,
    private ability: AppAbility,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit() {
    const dashboardSub = this.route.data.subscribe((data) => {
      this.status = "loading";
      this.dashboard = data.dashboard;
      if (data.dashboard.error) {
        this.viewService.status.next("error");
      } else {
        this.archiveStat = this.dashboard.archiveStat;
        this.archiveType = this.dashboard.archiveType;
        this.viewService.setDashboard(this.dashboard);
        this.error = null;
      }
    });

    const statusSub = this.viewService.status.subscribe(
      (status) => {
        this.status = status;
      },
      (error) => {
        console.log("error in dasbhboard detail status" + error);
      }
    );

    const errorSub = this.viewService.error.subscribe((error) => {
      this.error = error;
    });

    this.subscription.add(dashboardSub);
    this.subscription.add(statusSub);
    this.subscription.add(errorSub);
  }

  datesChanged({ startDate, endDate, liveMode, rangeInSeconds }) {
    this.viewService.datesChanged(startDate, endDate, liveMode, rangeInSeconds);
    this.unsaved = true;
    this.dataParamsChanged = true;
  }

  selectArchiveType(event) {
    this.viewService.setArchive(event.type, event.stat);
    this.unsaved = true;
    this.dataParamsChanged = true;
  }

  editDashboard() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  addWidget() {
    this.router.navigate(["widgets", "new"], { relativeTo: this.route });
  }

  deleteDashboard() {
    this.confirmDialog.open({
      title: `Delete: ${this.dashboard.name}`,
      message: "Are you sure? This action is permanent.",
      cancelText: "Cancel",
      confirmText: "Delete",
    });
    this.confirmDialog.confirmed().subscribe((confirm) => {
      if (confirm) {
        this.viewService.deleteDashboard(this.dashboard.id);
        this.router.navigate(["/dashboards"]);
      }
    });
  }

  refreshData() {
    this.viewService.updateData.next(this.dashboard.id);
    this.dataParamsChanged = false;
  }

  save() {
    if (this.ability.can("update", this.dashboard)) {
      this.unsaved = false;
      this.viewService.saveDashboard();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
