import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DashboardsService } from "@features/dashboards/services/dashboards.service";
import { DashboardEditComponent } from "../dashboard-edit.component";

@Component({
  selector: "app-dashboard-edit-entry",
  templateUrl: "./dashboard-edit-entry.component.html",
  styleUrls: ["./dashboard-edit-entry.component.scss"],
})
export class DashboardEditEntryComponent implements OnInit, OnDestroy {
  dialogRef;
  dashboardId;
  paramsSub;
  dashboard;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardsService: DashboardsService
  ) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe((params: Params) => {
      this.dashboardId = +params.dashboardId;

      if (this.route.parent) {
        this.dashboard = this.route.parent.snapshot.data.monitor;
      }

      if (this.dashboardId && !this.dashboard) {
        this.dashboardsService
          .getDashboard(this.dashboardId)
          .subscribe((dashboard) => {
            this.dashboard = dashboard;
            this.openMonitor();
          });
      } else {
        this.openMonitor();
      }
    });

    if (this.dialogRef) {
      this.dialogRef.afterClosed().subscribe(
        () => {
          if (this.dashboardId) {
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
  }

  openMonitor() {
    this.dialogRef = this.dialog.open(DashboardEditComponent, {
      closeOnNavigation: true,
      width: "70vw",
      data: {
        dashboard: this.dashboard,
      },
    });
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }
}
