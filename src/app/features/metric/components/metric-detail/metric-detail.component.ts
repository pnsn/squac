import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { MetricService } from "@metric/services/metric.service";
import { Metric } from "@core/models/metric";
import { Subscription } from "rxjs";

@Component({
  selector: "metric-detail",
  templateUrl: "./metric-detail.component.html",
  styleUrls: ["./metric-detail.component.scss"],
})
export class MetricDetailComponent implements OnInit, OnDestroy {
  id: number;
  metric: Metric;
  subscription: Subscription = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService
  ) {}

  ngOnInit() {
    const sub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.metricId;
        this.metricService.getMetric(this.id).subscribe((metric) => {
          this.metric = metric;
        });
      },
      (error) => {
        console.log("error in metric detail" + error);
      }
    );
    this.subscription.add(sub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  editMetric() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }
}
