import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MetricGroupsService } from '../../metric-groups.service';
import { Metric } from '../../shared/metric';

@Component({
  selector: 'app-metric-group-detail',
  templateUrl: './metric-groups-detail.component.html',
  styleUrls: ['./metric-groups-detail.component.scss']
})
export class MetricGroupsDetailComponent implements OnInit {
  id: number;
  metric: Metric;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private MetricGroupsService: MetricGroupsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.metric = this.MetricGroupsService.getMetric(this.id);
      }
    )
  }
  editMetric() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

}
