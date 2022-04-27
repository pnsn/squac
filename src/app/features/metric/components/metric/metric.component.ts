import { Component } from "@angular/core";
import { MetricService } from "@metric/services/metric.service";
import { Subscription } from "rxjs";

@Component({
  selector: "metric-main",
  template: "<router-outlet></router-outlet>",
})
export class MetricComponent {
  subscription: Subscription = new Subscription();
  constructor(private metricService: MetricService) {}
}
