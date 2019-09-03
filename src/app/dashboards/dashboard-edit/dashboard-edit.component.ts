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
  editMode : boolean;
  dashboardForm : FormGroup;
  subscriptions : Subscription= new Subscription();
  availableChannelGroups : ChannelGroup[];
  selectedChannelGroup : ChannelGroup;

  constructor(  
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService : DashboardsService,
    private channelGroupsService : ChannelGroupsService
  ) { }

  ngOnInit() {
    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;

        this.initForm();
      }
    )
    this.channelGroupsService.fetchChannelGroups();
    const sub1 = this.channelGroupsService.getChannelGroups.subscribe(channelGroups => {
      this.availableChannelGroups = channelGroups;
      console.log(this.availableChannelGroups)
    });

    this.subscriptions.add(paramsSub);
    this.subscriptions.add(sub1);
  }

  private initForm() {
    this.dashboardForm = new FormGroup({
      'name' : new FormControl("", Validators.required),
      "description" : new FormControl("", Validators.required),
      "channelGroup" : new FormControl([], Validators.required)
    });

    if (this.editMode) {
      let dashboardSub = this.dashboardService.getDashboard(this.id).subscribe(
        dashboard => {
          this.dashboard = dashboard;
          console.log("dashboard fetched", dashboard.name)
          this.dashboardForm.patchValue(
            {
              "name" : dashboard.name,
              "description" : dashboard.description,
              "channelGroup" : dashboard.channelGroupId
            }
          );
          this.selectedChannelGroup = dashboard.channelGroup;
        }
      );
      this.subscriptions.add(dashboardSub);
    }
  }

  getChannelsForChannelGroup(){

    let selectedChannelGroupId = this.dashboardForm.value.channelGroup;
    if(selectedChannelGroupId) {
      let channelGroupsSub = this.channelGroupsService.getChannelGroup(selectedChannelGroupId).subscribe(
        channelGroup => {
          this.selectedChannelGroup = channelGroup;
        }
      );
  
      this.subscriptions.add(channelGroupsSub);
    }

  }

  save() {
    let values = this.dashboardForm.value;
    console.log(values)
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
        console.log(result.id)
        this.cancel(result.id)
      }
    );
    this.cancel();
  }

  cancel(id?: number) {
    if(id && !this.id) {
      this.router.navigate(['../', id], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }
}
