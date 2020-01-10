import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MetricsService } from '../../shared/metrics.service';
import { Metric } from '../../shared/metric';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metrics-detail',
  templateUrl: './metrics-detail.component.html',
  styleUrls: ['./metrics-detail.component.scss']
})
export class MetricsDetailComponent implements OnInit, OnDestroy  {
  id: number;
  metric: Metric;
  subscription: Subscription = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricsService: MetricsService
  ) { }

  ngOnInit() {
    const sub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.metricsService.getMetric(this.id).subscribe(
          metric => {
            this.metric = metric;
          });
      }
    );
    this.subscription.add(sub);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  editMetric() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

}
