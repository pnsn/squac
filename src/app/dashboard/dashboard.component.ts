import { Component, OnInit } from '@angular/core';
import { MetricGroupsService } from '../metric-groups.service';
import { Subscription } from 'rxjs';
import { Metric } from '../shared/metric';
import { GroupsService } from '../groups.service';
import { Group } from '../shared/group';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  groups: Group[];
  subscription: Subscription = new Subscription();

  constructor(private groupsService: GroupsService) {

  }

  ngOnInit() {
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
