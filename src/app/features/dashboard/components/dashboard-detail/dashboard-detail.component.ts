import { Component, OnInit, OnDestroy } from "@angular/core";
import { Dashboard } from "@squacapi/models";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, EMPTY, Subscription, switchMap, tap } from "rxjs";
import { ViewService } from "@dashboard/services/view.service";
import { AppAbility } from "@core/utils/ability";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";
import { LoadingService } from "@core/services/loading.service";
import { DATE_PICKER_TIMERANGES } from "./dashboard-time-ranges";
import {
  ArchiveStatTypes,
  ArchiveTypes,
} from "@squacapi/interfaces/archivetypes";

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
  archiveType: ArchiveTypes;
  archiveStat: ArchiveStatTypes;
  startTime: string;
  endTime: string;
  channelGroupId: number;

  timeRange: number;
  // time picker config
  datePickerTimeRanges = DATE_PICKER_TIMERANGES;

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

          const groupId = +this.route.snapshot.queryParams.group;
          return this.loadingService.doLoading(
            this.viewService.setDashboardById(dashboardId, groupId).pipe(
              tap((channelGroup) => {
                if (channelGroup) {
                  this.channelGroupId = channelGroup.id;
                }

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
    this.archiveType = event.dataType;
    this.archiveStat = event.statType;
    this.updateArchiveType();
  }

  //if dates larger than 3 days, default to daily, larger than 1 month, monthly
  checkDates(): void {
    this.error = "";
    if (this.viewService.archiveType === "raw") {
      if (this.viewService.getTimeSpan("months") >= 4) {
        this.archiveType = ArchiveTypes.MONTH;
        this.archiveStat = ArchiveStatTypes.MEAN;
      } else if (this.viewService.getTimeSpan("weeks") >= 6) {
        this.archiveType = ArchiveTypes.WEEK;
        this.archiveStat = ArchiveStatTypes.MEAN;
      } else if (this.viewService.getTimeSpan("days") >= 7) {
        this.archiveType = ArchiveTypes.DAY;
        this.archiveStat = ArchiveStatTypes.MEAN;
      } else {
        this.archiveType = ArchiveTypes.RAW;
        this.archiveStat = null;
      }

      this.error = `Data type defaulted to ${this.archiveType} archive.`;
    }
    this.updateArchiveType();
  }

  private updateArchiveType() {
    this.checkArchiveType();
    this.viewService.setArchive(this.archiveType, this.archiveStat);
  }

  private checkArchiveType() {
    if (this.archiveType !== "raw") {
      if (this.viewService.getTimeSpan(this.archiveType) === 0) {
        //archiveType is larger than time window
        this.error = "Select a time range greater than the archive size.";
      }
    }
  }

  // tell view service the channels changed
  channelGroupChange(id: number): void {
    this.viewService.updateChannelGroup(id);
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

  //tell view service to get new data & save dashboard
  updateDashboard() {
    this.viewService.updateDashboard();
    this.save();
  }

  // tell view service to get new data
  refreshData(): void {
    this.viewService.updateData.next({ dashboard: this.dashboard.id });
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
