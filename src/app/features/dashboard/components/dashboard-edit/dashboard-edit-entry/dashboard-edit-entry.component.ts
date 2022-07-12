import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ChannelGroup } from "@core/models/channel-group";
import { DashboardService } from "@dashboard/services/dashboard.service";
import { Dashboard } from "@features/dashboard/models/dashboard";
import { Subscription } from "rxjs";
import { DashboardEditComponent } from "../dashboard-edit.component";

@Component({
  selector: "dashboard-edit-entry",
  template: "",
})
export class DashboardEditEntryComponent implements OnInit, OnDestroy {
  dialogRef: MatDialogRef<DashboardEditComponent>;
  dashboardId: number;
  paramsSub: Subscription;
  dashboard: Dashboard;
  channelGroups: ChannelGroup[];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    // selected dashboard
    this.paramsSub = this.route.params.subscribe((params) => {
      this.dashboardId = +params.dashboardId;
      this.dashboard = this.route.snapshot.data.dashboard;
      this.channelGroups = this.route.snapshot.data.channelGroups;
      this.openDashboard();
    });
  }

  // open dashboard modal
  openDashboard(): void {
    this.dialogRef = this.dialog.open(DashboardEditComponent, {
      closeOnNavigation: true,
      data: {
        dashboard: this.dashboard,
        channelGroups: this.channelGroups,
      },
    });
    this.dialogRef.afterClosed().subscribe({
      next: (id?: number) => {
        // go to newly created dashboard
        if (!this.dashboardId && id) {
          this.router.navigate(["../", id], { relativeTo: this.route });
        } else {
          // route to exit
          this.router.navigate(["../"], { relativeTo: this.route });
        }
      },
      error: (error) => {
        console.error("error in monitor detail: ", error);
      },
    });
  }

  //cleanup
  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }
}
