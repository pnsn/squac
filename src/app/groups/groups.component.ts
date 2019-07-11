import { Component, OnInit } from '@angular/core';
import { Metric } from '../shared/metric';
import { Group } from '../shared/group';
import { Subscription } from 'rxjs';
import { MetricsService } from '../metrics.service';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  metrics: Metric[];
  groups: Group[];
  subscription: Subscription = new Subscription();

  constructor(private metricsService: MetricsService, private groupsService: GroupsService) {

  }

  ngOnInit() {
    this.metrics = this.metricsService.getMetrics();
    this.subscription.add(this.metricsService.metricsChanged.subscribe(
      (metrics: Metric[]) => {
        this.metrics = metrics;
      }
    ));

    this.groups = this.groupsService.getGroups();
    this.subscription.add(this.groupsService.groupsChanged.subscribe(
      (groups: Group[]) => {
        this.groups = groups;
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
