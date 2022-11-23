import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { MetricEditComponent } from "../metric-edit.component";
import { Subscription } from "rxjs";
import { Metric } from "squacapi";

@Component({
  selector: "metric-edit-entry",
  template: "",
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

  openDialog(): void {
    this.dialogRef = this.dialog.open(MetricEditComponent, {
      closeOnNavigation: true,
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
      error: (error) => {
        console.error("error in monitor detail: ", error);
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
