import { Component, OnInit, OnDestroy } from "@angular/core";
import { MonitorEditComponent } from "../../components/monitor-edit/monitor-edit.component";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, switchMap } from "rxjs";
import { Metric } from "squacapi";
import { Monitor } from "squacapi";
import { ChannelGroupService } from "squacapi";

/**
 * Entry component for monitor edit modal
 * Used for routing
 */
@Component({
  selector: "monitor-edit-entry",
  template: "",
  standalone: true,
  imports: [MatDialogModule, MonitorEditComponent],
})
export class MonitorEditEntryComponent implements OnInit, OnDestroy {
  dialogRef: MatDialogRef<MonitorEditComponent>;
  monitorId: number;
  paramsSub: Subscription;
  metrics: Metric[];
  channelGroups: any;
  monitor: Monitor;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private channelGroupService: ChannelGroupService
  ) {}

  /** subscribe to route params */
  ngOnInit(): void {
    this.paramsSub = this.route.params
      .pipe(
        switchMap((params) => {
          this.monitorId = +params["monitorId"];
          if (this.route.snapshot && this.route.snapshot.data) {
            this.monitor = this.route.snapshot.data["monitor"];
            this.metrics = this.route.snapshot.data["metrics"];
          }
          return this.channelGroupService.getSortedChannelGroups({
            order: "name",
          });
        })
      )
      .subscribe((groups: any) => {
        this.channelGroups = groups;

        this.openMonitor();
      });
  }

  /** opens dialog */
  openMonitor(): void {
    this.dialogRef = this.dialog.open(MonitorEditComponent, {
      closeOnNavigation: true,
      maxWidth: 800,
      panelClass: "dialog-responsive",
      autoFocus: "first-header",
      data: {
        monitor: this.monitor,
        metrics: this.metrics,
        channelGroups: this.channelGroups,
      },
    });

    this.dialogRef.afterClosed().subscribe({
      next: () => {
        if (this.monitorId) {
          this.router.navigate(["../"], { relativeTo: this.route });
        } else {
          this.router.navigate(["../"], { relativeTo: this.route });
        }
        // route to exit
      },
    });
  }

  /** close dialog ref on exit */
  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }
}
