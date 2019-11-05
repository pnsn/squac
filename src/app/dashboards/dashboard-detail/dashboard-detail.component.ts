import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dashboard } from '../dashboard';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DashboardsService } from '../dashboards.service';
import { Widget } from '../widget';
import { Subscription, Subject } from 'rxjs';
import { WidgetsService } from '../widgets.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResizeEvent } from 'angular-resizable-element';

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
    },
    {
      name: "last 2 weeks",
      value: 168 * 2
    }
  ];
  startdate: Date;
  enddate: Date;
  selectedDateRange = this.dateRanges[2];
  editMode: boolean = false;

  columnWidth = 100;
  rowHeight = 100;

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
        this.startdate = this.calcDateRange(this.selectedDateRange.value);
        this.updateDashboard();

      }
    );
    this.subscription.add(dashboardsSub);
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

     //TODO: figure out ordering that saves
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

  onResizeEnd(event: ResizeEvent): void {
    const row = Math.round(event.rectangle.height / this.rowHeight);
    const column = Math.round(event.rectangle.width / this.columnWidth);


  //   this.widget.rows = row > 0 ? row : 1;
  //   this.widget.columns = column > 0 ? column : 1;

  //   this.styles = {
  //     "width.px" : this.widget.columns * this.columnWidth,
  //     "height.px" : this.widget.rows * this.rowHeight,
  //     "order": this.widget.order
  //   };

  //   this.widgetsService.updateWidget(this.widget).subscribe();
  //   setTimeout(()=>{
  //     window.dispatchEvent(new Event('resize'))
  //   }, 100);
  // }
  }

}
