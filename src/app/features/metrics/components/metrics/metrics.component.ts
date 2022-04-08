import { Component } from '@angular/core';
import { MetricsService } from '@features/metrics/services/metrics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent {
  subscription: Subscription = new Subscription();
  constructor(
    private metricsService: MetricsService
  ) { }

}
