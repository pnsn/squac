import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Widget } from '../../widgets/widget';
import { Subscription, Subject } from 'rxjs';
import { WidgetComponent } from 'src/app/widgets/widget.component';
import { ViewService } from 'src/app/shared/view.service';
import { WidgetEditComponent } from 'src/app/widgets/widget-edit/widget-edit.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss']
})
export class DashboardDetailComponent implements OnInit, OnDestroy {
  id: number;
  dashboard: Dashboard;
  widgets: Widget[];
  subscription: Subscription = new Subscription();

  dateRanges = [
    {
      name: 'last hour',
      value: 1
    },
    {
      name: 'last 24 hours ',
      value: 24
    },
    {
      name: 'last week',
      value: 24 * 7
    },
    {
      name: 'last 2 weeks',
      value: 168 * 2
    }
  ];
  selectedDateRange = this.dateRanges[2];
  editMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viewService: ViewService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    const dashSub = this.viewService.currentDashboard.subscribe(
      dashboard => {this.dashboard = dashboard}
    )

    const dashIdSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.viewService.dashboardSelected(this.id, this.calcDateRange(this.selectedDateRange.value), new Date());
        console.log("new dashboard");
      }
    );
    this.subscription.add(dashSub);
    this.subscription.add(dashIdSub)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  selectDateRange(event) {
    this.viewService.datesChanged(
      this.calcDateRange(event.value.value),
      new Date()
    );
  }

  calcDateRange(hours) {
    return new Date(new Date().getTime() - (hours * 60 * 60 * 1000));
  }

  refreshData() {
    this.viewService.refreshWidgets();
  }

  cancelEdit() {
    this.editMode = false;
  }

  saveDashboard() {
    // this.widgetComponent.save();
    //update 
    this.cancelEdit();
  }

  addWidget() {
    // this.router.navigate(['widget', 'new'], {relativeTo: this.route});
    let dialogRef = this.dialog.open(WidgetEditComponent, {
      data : {
        widget: null,
        dashboardId: this.dashboard.id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if(result && result.id){
        this.viewService.getWidgets(this.dashboard.id);
      }
      // this.animal = result;
    });
 
  }

  editWidgets() {
    this.editMode = true;
    // this.addWidget();
  }

}
