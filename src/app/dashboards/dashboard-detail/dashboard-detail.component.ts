import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Widget } from '../widget';
import { Subscription, Subject } from 'rxjs';
import { WidgetsService } from '../widgets.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  reload: Subject<boolean> = new Subject();
  dateRanges = [
    {
      name: "last hour",
      value: 1
    },
    {
      name: "last 24 hours ",
      value: 24
    },
    {
      name: "last week",
      value: 24 * 7
    }
  ];
  startdate: Date;
  enddate: Date;
  selectedDateRange = this.dateRanges[0];
  editMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardsService: DashboardsService,
    private widgetsService: WidgetsService
  ) { }

  ngOnInit() {
    const dashboardsSub = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.enddate = new Date();
        this.startdate = this.calcDateRange(1);
        this.updateDashboard();

      }
    );

    console.log(this.dateRanges)

    const widgetSub = this.widgetsService.widgetUpdated.subscribe(widgetId => {
      this.updateDashboard();
      // TODO: update just the widget
    });

    this.subscription.add(dashboardsSub);
    this.subscription.add(widgetSub);
  }

  updateDashboard() {
    this.subscription.add(this.dashboardsService.getDashboard(this.id).subscribe(
      dashboard => {
        this.dashboard = dashboard;
      }
    ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editDashboard() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  updateWidget(id) {
    console.log('refresh widget', id);
    // refresh the widget
  }

  selectDateRange(event) {
    this.enddate = new Date();
    this.startdate = this.calcDateRange(event.value.value);
    setTimeout(()=>{
      this.refreshData()
    }, 10)
  }

  calcDateRange(hours){
    return new Date(new Date().getTime() - (hours*60*60*1000));
  }

  refreshData() {
    // send refresh request to widgets listening
    this.reload.next(true);
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(
      this.dashboard.widgetIds, 
      event.previousIndex, 
      event.currentIndex
     );
  }

  cancelEdit() {
    this.editMode = false;
  }

  saveDashboard() {
    this.dashboardsService.updateDashboard(this.dashboard).subscribe();
    this.cancelEdit();
  }

  addWidget() {
    this.router.navigate(['widget', 'new'], {relativeTo: this.route});
  }

  editWidgets(){
    this.editMode = true;
    // this.addWidget();
  }
}
