import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Widget } from '@features/widgets/models/widget';
import { Subject, Subscription } from 'rxjs';
import { MeasurementsService } from '../../services/measurements.service';
import { ViewService } from '@core/services/view.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetEditComponent } from '../widget-edit/widget-edit.component';
import { Router, ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
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
      dates => {
        this.data = {};
        this.loading = true;
        // get new data and start timers over
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
    if (this.viewService.getEnddate && this.viewService.getStartdate) {
      this.measurementsService.fetchMeasurements(this.viewService.getStartdate(), this.viewService.getEnddate());
      console.log('get data', this.widget.id);
    }


    // TODO: Currently when page is refreshed or widget added, widgets reload completely
    // Rethink this so so that the new data can be added to widget seamlessly

  }


  editWidget() {
    this.router.navigate([this.widget.id, 'edit'], {relativeTo: this.route});
  }

  deleteWidget() {
    this.viewService.deleteWidget(this.widget.id);
  }
}
