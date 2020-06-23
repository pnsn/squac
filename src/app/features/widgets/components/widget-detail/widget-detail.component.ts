import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Widget } from '../../../../core/models/widget';
import { ChannelGroup } from '@core/models/channel-group';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WidgetsService } from '../../services/widgets.service';
import { MeasurementsService } from '../../services/measurements.service';
import { ViewService } from '@core/services/view.service';
import { DataFormatService } from '../../services/data-format.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetEditComponent } from '../widget-edit/widget-edit.component';

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
  dialogRef;
  loading: boolean = true;
  error : string;
  noData: boolean;
  // temp

  styles: any;

  constructor(
    private viewService: ViewService,
    private measurementsService: MeasurementsService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.loading = true;
    const dataSub = this.measurementsService.data.subscribe(
      data => {
        console.log(data);
        if(Object.keys(data).length === 0) {
          this.noData = true;
        } else {
          this.noData = false;
        }
        this.data = data;
      },
      error => {
        console.log('error in widget get data: ' + error);
        this.error = "Could not load widget";
      },
      () => {
        this.loading = false;
      }
    );

    this.measurementsService.setWidget(this.widget);

    const datesSub = this.viewService.dates.subscribe(
      dates => {
        console.log('new dates');
        this.data = {};
        this.loading = true;
        //get new data and start timers over
        this.getData();
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
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }


  private getData() {
    this.measurementsService.fetchMeasurements(this.viewService.getStartdate(), this.viewService.getEnddate());
    console.log("get data", this.widget.id)
    // TODO: Currently when page is refreshed or widget added, widgets reload completely
    // Rethink this so so that the new data can be added to widget seamlessly

  }


  editWidget() {
    this.dialogRef = this.dialog.open(WidgetEditComponent, {
      data : {
        widget: this.widget,
        dashboardId: this.widget.dashboardId
      }
    });
    this.dialogRef.afterClosed().subscribe(
      result => {
        if (result && result.id) {
          this.viewService.updateWidget(result.id);
        } else {
          console.log('widget edit closed without saving');
        }
      }, error => {
        console.log('error in widget detail: ' + error);
      }
    );
  }

  deleteWidget() {
    this.viewService.deleteWidget(this.widget.id);
  }
}
