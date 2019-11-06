//communicaiton betweetn widgets 
import { Injectable } from '@angular/core';
import { MeasurementsService } from './measurements.service';
import { Widget } from './widget';
import { ViewService } from '../shared/view.service';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class DataFormatService {

  private rawData : {};
  formattedData = new BehaviorSubject<any>(null);
  private widget;

  constructor(
    private measurementsService : MeasurementsService,
    private viewService : ViewService
  ) {
  }

  fetchData(widget : Widget) {
    this.widget = widget;
    this.measurementsService.getMeasurements(
      widget,
      this.viewService.getChannelGroup(),
      this.viewService.getStartdate(),
      this.viewService.getEnddate()
    ).subscribe(response => {
      this.rawData = response;
      console.log('data')
      this.formattedData.next(this.rawData);
    });
  }
}
