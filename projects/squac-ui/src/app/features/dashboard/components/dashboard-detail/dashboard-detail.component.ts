import { Component, OnInit, OnDestroy } from "@angular/core";
import { Dashboard } from "squacapi";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, EMPTY, Subscription, switchMap, tap } from "rxjs";
import { ViewService } from "@dashboard/services/view.service";
import { AppAbility } from "@core/utils/ability";
import { ConfirmDialogService } from "@core/services/confirm-dialog.service";
import { MessageService } from "@core/services/message.service";
import { LoadingService } from "@core/services/loading.service";
import { DATE_PICKER_TIMERANGES } from "./dashboard-time-ranges";
import { ArchiveStatType, ArchiveType } from "squacapi";

/**
 * Individual dashboard view
 */
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
  archiveType: ArchiveType;
  archiveStat: ArchiveStatType;
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

  /**
   * Subscribe to route params for dashboard id
   */
  ngOnInit(): void {
    const paramsSub = this.route.params
      .pipe(
        tap(() => {
          this.error = null;
        }),
        switchMap((params) => {
          // get dashboard id & channel group id
          const dashboardId = +params["dashboardId"];
          const groupId = +this.route.snapshot.queryParams["group"];

          // request info
          return this.loadingService.doLoading(
            this.viewService.setDashboardById(dashboardId, groupId).pipe(
              tap((channelGroup) => {
                if (channelGroup) {
                  this.channelGroupId = channelGroup.id;
                }
                this.dashboard = this.viewService.dashboard;
                this.archiveStat = this.viewService.archiveStat;
                this.archiveType = this.viewService.archiveType;
                console.log(this.archiveStat, this.archiveType);
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

  /**
   * Send selected dates to view service
   *
   * @param root0 event
   * @param root0.startDate startdate
   * @param root0.endDate enddate
   * @param root0.liveMode isLive
   * @param root0.rangeInSeconds time range
   */
  datesChanged({ startDate, endDate, liveMode, rangeInSeconds }): void {
    this.viewService.datesChanged(startDate, endDate, liveMode, rangeInSeconds);
    this.checkDates();
  }

  /**
   * Save selected archive type and send to view service
   *
   * @param event selection event
   */
  selectArchiveType(event): void {
    this.archiveType = event.dataType;
    this.archiveStat = event.statType;
    this.updateArchiveType();
  }

  /**
   * Validate dates
   * if dates larger than 3 days, default to daily, larger than 1 month, monthly
   */
  checkDates(): void {
    this.error = "";
    if (this.viewService.archiveType === "raw") {
      if (this.viewService.getTimeSpan("months") >= 4) {
        this.error = `Raw data request may be too large for this time range, try using month archives.`;
      } else if (this.viewService.getTimeSpan("weeks") >= 6) {
        this.error = `Raw data request may be too large for this time range, try using week archives.`;
      } else if (this.viewService.getTimeSpan("days") >= 7) {
        this.error = `Raw data request may be too large for this time range, try using day archives.`;
      }
    }
    this.updateArchiveType();
  }

  /**
   * Send changes to view service
   */
  private updateArchiveType(): void {
    this.checkArchiveType();
    this.viewService.setArchive(this.archiveType, this.archiveStat);
  }

  /**
   * Validate archive type
   */
  private checkArchiveType(): void {
    if (this.archiveType !== "raw") {
      if (this.viewService.getTimeSpan(this.archiveType) === 0) {
        //archiveType is larger than time window
        this.error = "Select a time range greater than the archive size.";
      }
    }
  }

  /**
   * Emit channel group changes to view service
   *
   * @param id new group id
   */
  channelGroupChange(id: number): void {
    this.viewService.updateChannelGroup(id);
  }

  /**
   * Navigate to edit route
   */
  editDashboard(): void {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  /**
   * Navigate to edit widget route
   */
  addWidget(): void {
    this.router.navigate(["widgets", "new"], { relativeTo: this.route });
  }

  /**
   * Delete dashboard after confirmation
   */
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

  /**
   * Tell view service to get new data and save changes.
   */
  updateDashboard(): void {
    this.viewService.updateDashboard();
    this.save();
  }

  /**
   * Tell view service to get new data
   */
  refreshData(): void {
    this.viewService.updateData.next({ dashboard: this.dashboard.id });
  }

  /**
   * Save dashboard
   */
  save(): void {
    if (this.ability.can("update", this.dashboard)) {
      this.viewService.saveDashboard();
    }
  }

  /**
   * unsubscribe
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
