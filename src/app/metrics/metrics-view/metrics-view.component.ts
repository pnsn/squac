import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Metric } from '../../shared/metric';
import { MetricsService } from '../../shared/metrics.service';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-metrics-view',
  templateUrl: './metrics-view.component.html',
  styleUrls: ['./metrics-view.component.scss']
})
export class MetricsViewComponent implements OnInit, OnDestroy {
  metrics: Metric[];
  subscription: Subscription;

  //Table stuff
  ColumnMode = ColumnMode;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private metricsService: MetricsService
  ) {
  } 

  ngOnInit() {
    this.subscription = this.metricsService.getMetrics.subscribe(
      (metrics: Metric[]) => {
        this.metrics = metrics;
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addMetric() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}

