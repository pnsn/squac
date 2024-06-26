import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { MetricEditComponent } from "../../components/metric-edit/metric-edit.component";
import { Subscription } from "rxjs";
import { Metric } from "squacapi";

/**
 * Entry component for metric edit
 * Used for routing
 */
@Component({
  selector: "metric-edit-entry",
  template: "",
  standalone: true,
  imports: [MatDialogModule],
})
export class MetricEditEntryComponent implements OnInit, OnDestroy {
  dialogRef: MatDialogRef<MetricEditComponent>;
  metricId: number;
  paramsSub: Subscription;
  metric: Metric;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /** subscribe to route */
  ngOnInit(): void {
    // get metric info
    this.paramsSub = this.route.params.subscribe({
      next: () => {
        this.metricId = +this.route.snapshot.params["metricId"];
        this.metric = this.route.snapshot.data["metric"];

        this.openDialog();
      },
    });
  }

  /** open edit dialog */
  openDialog(): void {
    this.dialogRef = this.dialog.open(MetricEditComponent, {
      closeOnNavigation: true,
      panelClass: "dialog-responsive",
      autoFocus: "first-header",
      data: {
        metric: this.metric,
      },
    });
    this.dialogRef.afterClosed().subscribe({
      next: () => {
        // go to newly created metric
        if (this.metricId) {
          this.router.navigate(["../../"], { relativeTo: this.route });
        } else {
          this.router.navigate(["../"], { relativeTo: this.route });
        }
        // route to exit
      },
    });
  }

  /** close dialog on exit */
  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.paramsSub.unsubscribe();
  }
}
