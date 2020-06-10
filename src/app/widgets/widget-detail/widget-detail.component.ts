import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Widget } from '../widget';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WidgetsService } from '../widgets.service';
import { MeasurementsService } from '../measurements.service';
import { ViewService } from 'src/app/shared/view.service';
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
  // temp

  styles: any;

  constructor(
    private viewService: ViewService,
    private measurementsService: MeasurementsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loading = true;

    const datesSub = this.viewService.dates.subscribe(
      dates => {
        console.log('new dates');
        this.getData(dates.start, dates.end);
        this.viewService.status.next("loading");
      },
      error => {
        console.log('error in widget detail dates: ' + error);
      }
    );

    this.subscription.add(datesSub);
    // widget data errors here
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getData(this.viewService.getStartdate(), this.viewService.getEnddate());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }


  private getData(start, end) {
    console.log("get data", this.widget.id)
    // TODO: Currently when page is refreshed or widget added, widgets reload completely
    // Rethink this so so that the new data can be added to widget seamlessly
    const measurementsService = this.measurementsService.getMeasurements(
      this.widget,
      start,
      end
    ).subscribe(
      response => {
        console.log(response);
        this.data = response;
        this.loading = false;
      },
      error => {
        console.log('error in widget get data: ' + error);
      }
    );

    this.subscription.add(measurementsService);
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
          console.log('widget edited and something went wrong');
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
