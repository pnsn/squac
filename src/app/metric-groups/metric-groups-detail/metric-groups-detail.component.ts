import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MetricGroupsService } from '../../shared/metric-groups.service';
import { MetricGroup } from '../../shared/metric-group';

@Component({
  selector: 'app-metric-groups-detail',
  templateUrl: './metric-groups-detail.component.html',
  styleUrls: ['./metric-groups-detail.component.scss']
})
export class MetricGroupsDetailComponent implements OnInit {
  id: number;
  metricGroup: MetricGroup;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private MetricGroupsService: MetricGroupsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.metricGroup = this.MetricGroupsService.getMetricGroup(this.id);
      }
    )
  }
  editMetricGroup() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

}