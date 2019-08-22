import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MetricsService } from '../../shared/metrics.service';
import { Metric } from '../../shared/metric';

@Component({
  selector: 'app-metrics-detail',
  templateUrl: './metrics-detail.component.html',
  styleUrls: ['./metrics-detail.component.scss']
})
export class MetricsDetailComponent implements OnInit {
  id: number;
  metric: Metric;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricsService: MetricsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.metricsService.getMetric(this.id).subscribe(
          metric => {
            console.log(metric)
            this.metric = metric;
          });
      }
    )
  }
  editMetric() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

}
