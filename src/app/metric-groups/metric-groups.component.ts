import { Component, OnInit, OnDestroy } from '@angular/core';
import { Metric } from '../shared/metric';
import { MetricGroupsService } from '../metric-groups.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-metrics',
  templateUrl: './metric-groups.component.html',
  styleUrls: ['./metric-groups.component.scss']
})
export class MetricGroupsComponent implements OnInit, OnDestroy {
  metrics: Metric[];
  subscription: Subscription;
  constructor(  
    private MetricGroupsService: MetricGroupsService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.metrics = this.MetricGroupsService.getMetrics();
    this.subscription = this.MetricGroupsService.metricsChanged.subscribe(
      (metrics: Metric[]) => {
        this.metrics = metrics;
      }
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addMetric() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
