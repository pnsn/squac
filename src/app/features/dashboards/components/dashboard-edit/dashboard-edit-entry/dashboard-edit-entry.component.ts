import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
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
    this.paramsSub = this.route.params.subscribe(() => {
      if (this.route.parent) {
        this.dashboardId = +this.route.parent.snapshot.params.dashboardId;
        this.dashboard = this.route.parent.snapshot.data.dashboard;
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
        (id?: number) => {
          // go to newly created dashboard
          if (!this.dashboardId && id) {
            this.router.navigate(["../", id], { relativeTo: this.route });
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