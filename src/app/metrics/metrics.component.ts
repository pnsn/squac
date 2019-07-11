import { Component, OnInit, OnDestroy } from '@angular/core';
import { Metric } from '../shared/metric';
import { MetricsService } from '../metrics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit, OnDestroy {
  metrics: Metric[];
  subscription: Subscription;
  constructor(private metricsService: MetricsService) {

  }

  ngOnInit() {
    this.metrics = this.metricsService.getMetrics();
    this.subscription = this.metricsService.metricsChanged.subscribe(
      (metrics: Metric[]) => {
        this.metrics = metrics;
      }
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
