import { Component, OnInit, OnDestroy } from "@angular/core";
import { MonitorEditComponent } from "../monitor-edit/monitor-edit.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { Metric } from "@core/models/metric";
import { ChannelGroup } from "@core/models/channel-group";
import { Monitor } from "@features/monitor/models/monitor";

@Component({
  selector: "monitor-edit-entry",
  template: "",
})
export class MonitorEditEntryComponent implements OnInit, OnDestroy {
  dialogRef: MatDialogRef<MonitorEditComponent>;
  monitorId: number;
  paramsSub: Subscription;
  metrics: Metric[];
  channelGroups: ChannelGroup[];
  monitor: Monitor;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe((params: Params) => {
      this.monitorId = +params.monitorId;

      if (this.route.snapshot && this.route.snapshot.data) {
        this.monitor = this.route.snapshot.data.monitor;
        this.metrics = this.route.snapshot.data.metrics;
        this.channelGroups = this.route.snapshot.data.channelGroups;
      }

      this.openMonitor();
    });
  }

  openMonitor(): void {
    this.dialogRef = this.dialog.open(MonitorEditComponent, {
      closeOnNavigation: true,
      width: "70vw",
      data: {
        monitor: this.monitor,
        metrics: this.metrics,
        channelGroups: this.channelGroups,
      },
    });

    this.dialogRef.afterClosed().subscribe(
      () => {
        if (this.monitorId) {
          this.router.navigate(["../../"], { relativeTo: this.route });
        } else {
          this.router.navigate(["../"], { relativeTo: this.route });
        }
        // route to exit
      },
      (error) => {
        console.log("error in monitor detail: " + error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }
}
