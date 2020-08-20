import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dashboard } from '../../models/dashboard';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DashboardsService } from '../../services/dashboards.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-edit',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.scss']
})
export class DashboardEditComponent implements OnInit, OnDestroy {
  id: number;
  dashboard: Dashboard;
  editMode: boolean;
  dashboardForm: FormGroup;
  subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardsService
  ) { }

  ngOnInit() {
    this.dashboardForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      shareAll: [false],
      shareOrg: [false]
    });

    const paramsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = !!this.id;

        this.initForm();
      },
      error => {
        console.log('error getting params: ' + error);
      }
    );

    this.subscriptions.add(paramsSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm() {

    if (this.editMode) {
      this.dashboard = this.route.snapshot.data.dashboard;
      console.log(this.dashboard)
      this.dashboardForm.patchValue(
        {
          name : this.dashboard.name,
          description : this.dashboard.description,
          shareAll: this.dashboard.shareAll,
          shareOrg: this.dashboard.shareOrg
        }
      );

      // const dashboardSub = this.dashboardService.getDashboard(this.id).subscribe(
      //   dashboard => {
      //     this.dashboard = dashboard;
      //     this.dashboardForm.patchValue(
      //       {
      //         name : dashboard.name,
      //         description : dashboard.description,
      //         shareAll: dashboard.shareAll,
      //         shareOrg: dashboard.shareOrg
      //       }
      //     );
      //   },
      //   error => {
      //     console.log('error in dashboard edit: ' + error);
      //   }
      // );
      // this.subscriptions.add(dashboardSub);
    }
  }

  save() {
    const values = this.dashboardForm.value;
    this.dashboardService.updateDashboard(
      new Dashboard(
        this.id,
        null,
        values.name,
        values.description,
        values.shareOrg,
        values.shareAll,
        this.dashboard.orgId,
        this.dashboard.widgetIds
      )
    ).subscribe(
      result => {
        this.cancel(result.id);
      },
      error => {
        console.log('error in save dashboard: ' + error);
      }
    );
  }

  cancel(id?: number) {
    if (id && !this.id) {
      this.router.navigate(['../', id], {relativeTo: this.route});
    } else {
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }
}
