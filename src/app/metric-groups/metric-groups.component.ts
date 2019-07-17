import { Component, OnInit, OnDestroy } from '@angular/core';
import { MetricGroup } from '../shared/metric-group';
import { MetricGroupsService } from '../metric-groups.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-metric-groups',
  templateUrl: './metric-groups.component.html',
  styleUrls: ['./metric-groups.component.scss']
})
export class MetricGroupsComponent implements OnInit, OnDestroy {
  metricGroups: MetricGroup[];
  subscription: Subscription;
  constructor(  
    private MetricGroupsService: MetricGroupsService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.metricGroups = this.MetricGroupsService.getMetricGroups();
    this.subscription = this.MetricGroupsService.metricGroupsChanged.subscribe(
      (metricGroups: MetricGroup[]) => {
        this.metricGroups = metricGroups;
      }
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addMetricGroup() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
