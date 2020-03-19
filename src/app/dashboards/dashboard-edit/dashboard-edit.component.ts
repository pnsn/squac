import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dashboard } from '../dashboard';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
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
    private dashboardService: DashboardsService
  ) { }

  ngOnInit() {
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
    this.dashboardForm = new FormGroup({
      name : new FormControl('', Validators.required),
      description : new FormControl('', Validators.required)
    });

    if (this.editMode) {
      const dashboardSub = this.dashboardService.getDashboard(this.id).subscribe(
        dashboard => {
          this.dashboard = dashboard;
          this.dashboardForm.patchValue(
            {
              name : dashboard.name,
              description : dashboard.description
            }
          );
        },
        error => {
          console.log('error in dashboard edit: ' + error);
        }
      );
      this.subscriptions.add(dashboardSub);
    }
  }

  save() {
    const values = this.dashboardForm.value;
    this.dashboardService.updateDashboard(
      new Dashboard(
        this.id,
        values.name,
        values.description,
        []
      )
    ).subscribe(
      result => {
        this.cancel(result.id);
      },
      error => {
        console.log('error in save dashboard: ' + error);
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
