
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MetricGroup } from '../../shared/metric-group';
import { MetricGroupsService } from '../../shared/metric-groups.service';
import { OnInit, OnDestroy, Component } from '@angular/core';

@Component({
  selector: 'app-metric-groups-view',
  templateUrl: './metric-groups-view.component.html',
  styleUrls: ['./metric-groups-view.component.scss']
})
export class MetricGroupsViewComponent implements OnInit, OnDestroy {
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