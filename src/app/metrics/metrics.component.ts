import { Component, OnInit, OnDestroy } from '@angular/core';
import { MetricsService } from '../shared/metrics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  constructor(
    private metricsService : MetricsService
  ) { }

  ngOnInit() {
    
    const metricsService = this.metricsService.fetchMetrics();
    this.subscription.add(metricsService);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    
  }

}
