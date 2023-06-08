import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ChannelGroup } from "squacapi";
import { Dashboard } from "squacapi";
import { Subscription } from "rxjs";
import { DashboardEditComponent } from "../dashboard-edit.component";

/**
 * Entry component for dashboard edit modal
 */
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
  channelGroupId: number;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * subscribe to params
   */
  ngOnInit(): void {
    // selected dashboard
    this.paramsSub = this.route.params.subscribe((params) => {
      this.dashboardId = +params["dashboardId"];
      this.dashboard = this.route.snapshot.data["dashboard"];
      this.channelGroups = this.route.snapshot.data["channelGroups"];
      const queryParams = this.route.snapshot.queryParams;
      this.channelGroupId = +queryParams["group"];

      this.openDashboard();
    });
  }

  /**
   * opens dashboard edit modal
   */
  openDashboard(): void {
    this.dialogRef = this.dialog.open(DashboardEditComponent, {
      closeOnNavigation: true,
      maxWidth: 800,
      panelClass: "dialog-responsive",
      autoFocus: "first-header",
      data: {
        dashboard: this.dashboard,
        channelGroups: this.channelGroups,
        channelGroupId: this.channelGroupId,
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
    });
  }

  /**
   * destroy & cleanup
   */
  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }
}
