import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { MetricEditComponent } from "../metric-edit/metric-edit.component";
import { MetricService } from "../../services/metric.service";

@Component({
  selector: "metric-edit-entry",
  template: "",
})
export class MetricEditEntryComponent implements OnInit, OnDestroy {
  dialogRef;
  metricId;
  paramsSub;
  metric;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService
  ) {}

  ngOnInit(): void {
    this.paramsSub = this.route.params.subscribe(() => {
      this.metricId = +this.route.snapshot.params.metricId;
      this.metric = this.route.snapshot.data.metric;

      if (this.metricId && !this.metric) {
        this.metricService.getMetric(this.metricId).subscribe((metric) => {
          this.metric = metric;
          this.openDialog();
        });
      } else {
        this.openDialog();
      }
    });
  }

  openDialog() {
    this.dialogRef = this.dialog.open(MetricEditComponent, {
      closeOnNavigation: true,
      data: {
        metric: this.metric,
      },
    });
    this.dialogRef.afterClosed().subscribe(
      () => {
        // go to newly created metric
        if (this.metricId) {
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
