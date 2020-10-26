import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Widget } from '@features/widgets/models/widget';
import { Subject, Subscription } from 'rxjs';
import { MeasurementsService } from '../../services/measurements.service';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetEditComponent } from '../widget-edit/widget-edit.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';

@Component({
  selector: 'app-widget-detail',
  templateUrl: './widget-detail.component.html',
  styleUrls: ['./widget-detail.component.scss'],
  providers: [MeasurementsService]
})
export class WidgetDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() widget: Widget;
  data: any;
  subscription = new Subscription();
  dataUpdate = new Subject<any>();
  loading = true;
  error: string;
  noData: boolean;
  // temp

  styles: any;

  constructor(
    private viewService: ViewService,
    private measurementsService: MeasurementsService,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialog: ConfirmDialogService
  ) {

  }

  ngOnInit() {
    this.loading = true;
    const dataSub = this.measurementsService.data.subscribe(
      data => {
        this.noData = data && Object.keys(data).length === 0;
        this.data = data;
        this.loading = false;
      }
    );

    this.measurementsService.setWidget(this.widget);

    const datesSub = this.viewService.dates.subscribe(
      dashboardId => {
        this.data = {};
        if (this.widget.dashboardId === dashboardId) {
          this.loading = true;
          // get new data and start timers over
          this.getData();
        }
      },
      error => {
        console.log('error in widget detail dates: ' + error);
      }
    );


    this.subscription.add(datesSub);

    this.subscription.add(dataSub);
    // widget data errors here
  }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    // this.getData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  refreshWidget() {
    this.getData();
  }

  private getData() {
    this.measurementsService.fetchMeasurements();
  }


  editWidget() {
    this.router.navigate([this.widget.id, 'edit'], {relativeTo: this.route});
  }

  deleteWidget() {
    this.confirmDialog.open(
      {
        title: `Delete: ${this.widget.name}`,
        message: 'Are you sure? This action is permanent.',
        cancelText: 'Cancel',
        confirmText: 'Delete'
      }
    );
    this.confirmDialog.confirmed().subscribe(
      confirm => {
        if (confirm) {
          this.viewService.deleteWidget(this.widget.id);
        }
    });
  }
}
