import { Component, OnInit, OnDestroy } from "@angular/core";
import { Dashboard } from "../../models/dashboard";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, EMPTY, Subscription, switchMap, tap } from "rxjs";
import { ViewService } from "@core/services/view.service";
import { AppAbility } from "@core/utils/ability";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";
import { LoadingService } from "@core/services/loading.service";

// Individual dashboard
@Component({
  selector: "dashboard-detail",
  templateUrl: "./dashboard-detail.component.html",
  styleUrls: ["./dashboard-detail.component.scss"],
})
export class DashboardDetailComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  dashboard: Dashboard;
  status: string;
  error: string = null;
  // dashboard params
  archiveType: string;
  archiveStat: string;
  startTime: string;
  endTime: string;
  channelGroupId: number;
  sideNavOpened = true;
  timeRange: number;
  // time picker config
  datePickerTimeRanges = [
    {
      amount: "30",
      unit: "minutes",
    },
    {
      amount: "1",
      unit: "hour",
    },
    {
      amount: "6",
      unit: "hours",
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
      amount: "1",
      unit: "month",
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public viewService: ViewService,
    private ability: AppAbility,
    private confirmDialog: ConfirmDialogService,
    private messageService: MessageService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const paramsSub = this.route.params
      .pipe(
        tap(() => {
          this.error = null;
        }),
        switchMap((params) => {
          const dashboardId = +params.dashboardId;
          const groupId = +params.group;
          return this.loadingService.doLoading(
            this.viewService.setDashboardById(dashboardId, groupId).pipe(
              tap(() => {
                this.channelGroupId =
                  this.viewService.channelGroupId.getValue();
                this.dashboard = this.viewService.dashboard;
                this.archiveStat = this.viewService.archiveStat;
                this.archiveType = this.viewService.archiveType;
                this.timeRange = this.viewService.range;
                this.startTime = this.viewService.startTime;
                this.endTime = this.viewService.endTime;
              }),
              catchError(() => {
                if (!this.dashboard) {
                  this.messageService.error("Could not load dashboard.");
                } else {
                  this.messageService.error("Could not load channel group.");
                }
                return EMPTY;
              })
            )
          );
        })
      )
      .subscribe();

    // get any errors to show from view service
    const errorSub = this.viewService.error.subscribe({
      next: (error) => {
        this.error = error;
      },
    });

    this.subscription.add(paramsSub);
    this.subscription.add(errorSub);
  }

  // send selected dates to view service
  datesChanged({ startDate, endDate, liveMode, rangeInSeconds }): void {
    this.viewService.datesChanged(startDate, endDate, liveMode, rangeInSeconds);
    this.checkDates();
  }

  // send selected archive type to views ervice
  selectArchiveType(event): void {
    this.viewService.setArchive(event.dataType, event.statType);
    this.save();
    this.refreshData();
  }

  //if dates larger than 3 days, default to daily, larger than 1 month, monthly
  checkDates(): void {
    if (this.viewService.archiveType === "raw") {
      if (this.viewService.getTimeSpan("months") >= 4) {
        this.archiveType = "day";
        this.archiveStat = "mean";
      } else if (this.viewService.getTimeSpan("days") >= 7) {
        this.archiveType = "hour";
        this.archiveStat = "mean";
      } else {
        this.archiveType = "raw";
        this.archiveStat = "";
      }
    }
    this.save();
    this.viewService.setArchive(this.archiveType, this.archiveStat);
    this.refreshData();
  }

  toggleSidenav(): void {
    this.viewService.resizeAll();
  }

  // tell view service the channels changed
  channelGroupChange(id: number): void {
    this.loadingService
      .doLoading(this.viewService.updateChannelGroup(id), this)
      .subscribe();
  }

  // route to edit dashboard
  editDashboard(): void {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  // route to edit widget
  addWidget(): void {
    this.router.navigate(["widgets", "new"], { relativeTo: this.route });
  }

  // confirm user wants to delete
  deleteDashboard(): void {
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

  // tell view service to get new data
  refreshData(): void {
    this.viewService.updateData.next(this.dashboard.id);
  }

  // save dashboard
  save(): void {
    if (this.ability.can("update", this.dashboard)) {
      this.viewService.saveDashboard();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
