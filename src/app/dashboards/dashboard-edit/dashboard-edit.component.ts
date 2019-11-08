import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../dashboard';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Subscription } from 'rxjs';
import { ChannelGroupsService } from '../../channel-groups/channel-groups.service';
import { ChannelGroup } from '../../shared/channel-group';

@Component({
  selector: 'app-dashboard-edit',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.scss']
})
export class DashboardEditComponent implements OnInit {
  id: number;
  dashboard: Dashboard;
  editMode: boolean;
  dashboardForm: FormGroup;
  subscriptions: Subscription = new Subscription();
  availableChannelGroups: ChannelGroup[];
  selectedChannelGroup: ChannelGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService: DashboardsService,
    private channelGroupsService: ChannelGroupsService
  ) { }

  ngOnInit() {
    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;

        this.initForm();
      }
    );
    this.channelGroupsService.fetchChannelGroups();
    const sub1 = this.channelGroupsService.getChannelGroups.subscribe(channelGroups => {
      this.availableChannelGroups = channelGroups;
    });

    this.subscriptions.add(paramsSub);
    this.subscriptions.add(sub1);
  }

  private initForm() {
    this.dashboardForm = new FormGroup({
      name : new FormControl('', Validators.required),
      description : new FormControl('', Validators.required),
      channelGroup : new FormControl([], Validators.required)
    });

    if (this.editMode) {
      const dashboardSub = this.dashboardService.getDashboard(this.id).subscribe(
        dashboard => {
          this.dashboard = dashboard;
          this.dashboardForm.patchValue(
            {
              name : dashboard.name,
              description : dashboard.description,
              channelGroup : dashboard.channelGroupId
            }
          );
          this.selectedChannelGroup = dashboard.channelGroup;
        }
      );
      this.subscriptions.add(dashboardSub);
    }
  }

  getChannelsForChannelGroup(event) {
    console.log(event);
    const selectedChannelGroupId = this.dashboardForm.value.channelGroup;
    if (selectedChannelGroupId) {
      const channelGroupsSub = this.channelGroupsService.getChannelGroup(selectedChannelGroupId).subscribe(
        channelGroup => {
          this.selectedChannelGroup = channelGroup;
        }
      );

      this.subscriptions.add(channelGroupsSub);
    }

  }

  save() {
    const values = this.dashboardForm.value;
    this.dashboardService.updateDashboard(
      new Dashboard(
        this.id,
        values.name,
        values.description,
        values.channelGroup,
        []
      )
    ).subscribe(
      result => {
        this.cancel(result.id);
      }
    );
    this.cancel();
  }

  cancel(id?: number) {
    if (id && !this.id) {
      this.router.navigate(['../', id], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }
}
