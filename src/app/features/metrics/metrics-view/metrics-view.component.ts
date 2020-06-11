import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Metric } from '../../../core/models/metric';
import { MetricsService } from '../../../core/services/metrics.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-metrics-view',
  templateUrl: './metrics-view.component.html',
  styleUrls: ['./metrics-view.component.scss']
})
export class MetricsViewComponent implements OnInit, OnDestroy {
  metrics: Metric[];
  subscription: Subscription = new Subscription();
  selectedMetric: Metric;
  selected = false;

  // Table stuff
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

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
      },
      error => {
        console.log('error in metrics view:' + error);
      }
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addMetric() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  editMetric() {
    this.router.navigate([`${this.selectedMetric.id}/edit`], {relativeTo: this.route});
  }

  onSelect($event) {
    this.selected = true;
    this.metricsService.getMetric($event.selected[0].id).subscribe(
      metric => {
        this.selectedMetric = metric;
      },
      error => {
        console.log('error in metrics view: ' + error);
      }
    );
  }
}

