import { Component, OnInit } from '@angular/core';
import { Metric } from '../shared/metric';
import { Group } from '../shared/group';
import { Subscription } from 'rxjs';
import { MetricGroupsService } from '../metric-groups.service';
import { GroupsService } from '../groups.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  metrics: Metric[];
  groups: Group[];
  subscription: Subscription = new Subscription();

  constructor(
    private MetricGroupsService: MetricGroupsService,
    private groupsService: GroupsService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.metrics = this.MetricGroupsService.getMetrics();
    this.subscription.add(this.MetricGroupsService.metricsChanged.subscribe(
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

  addGroup() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
