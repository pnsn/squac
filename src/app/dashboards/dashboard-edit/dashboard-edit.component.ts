import { Component, OnInit } from '@angular/core';
import { Dashboard } from '../dashboard';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MetricGroupsService } from '../../shared/metric-groups.service';
import { DashboardsService } from '../dashboards.service';

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

  constructor(  
    private router: Router,
    private route: ActivatedRoute,
    private dashboardService : DashboardsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;

        this.initForm();
      }
    )
  }

  private initForm() {
    let dashboardName = "";

    if (this.editMode) {
      const dashboard = this.dashboardService.getDashboard(this.id);
      dashboardName = dashboard.name;
    }

    this.dashboardForm = new FormGroup({
      'name' : new FormControl(dashboardName, Validators.required)
    });
  }

  save() {
    //save metric
    this.dashboardService.updateDashboard(this.id, this.dashboardForm.value);
    this.cancel();
  }

  cancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
