import { Injectable } from '@angular/core';
import { Subject, forkJoin, BehaviorSubject } from 'rxjs';
import { UserService } from '@features/user/services/user.service';
import { OrganizationsService } from '@features/user/services/organizations.service';
import { DashboardsService } from '@features/dashboards/services/dashboards.service';
import { ChannelGroupsService } from '@features/channel-groups/services/channel-groups.service';
import { MetricsService } from '@features/metrics/services/metrics.service';
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading: Subject<boolean> = new BehaviorSubject(false);
  loadingStatus: Subject<string> = new BehaviorSubject(null);

  activeRequests: number = 0;
  constructor(
    private userService: UserService,
    private organizationService: OrganizationsService,
    private dashboardsService: DashboardsService,
    private channelGroupsService: ChannelGroupsService,
    private metricsService: MetricsService
  ) { }


  setStatus(text : string) {
    this.loadingStatus.next(text);
  }

  getInitialData() {
    this.loadingStatus.next("Logging in and loading data...");
    this.startLoading();
    forkJoin(
      this.userService.getUser(),
      this.organizationService.getOrganizations(),
      this.dashboardsService.getDashboards(),
      this.channelGroupsService.getChannelGroups(),
      this.metricsService.getMetrics()
    ).subscribe(
      ([users, organizations]) => {
        this.stopLoading();
        console.log("done getting data");
      }
    )

    //get User
    //get Organizations
    //get Dashboards
    //get ChannelGroups
    //get Stattypes
    //get Metrics
  }





  startLoading() {
    this.loading.next(true);

  }

  stopLoading() {
    this.loading.next(false);
    this.loadingStatus.next(null);
  }

}
