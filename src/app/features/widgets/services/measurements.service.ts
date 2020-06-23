import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Measurement } from '../models/measurement';
import { Widget } from '../../../core/models/widget';
import { formatDate } from '@angular/common';
import { SquacApiService } from '@core/services/squacapi.service';

interface MeasurementsHttpData {
  name: string;
  description: string;
  url: string;
  unit: string;
  id?: number;
}

@Injectable()
export class MeasurementsService implements OnDestroy{
  private url = 'measurement/measurements/';
  data = new Subject();
  private localData = {};
  private widget;
  private refreshInterval = 1 * 60 * 1000; //5 mintues now, this will be config
  private lastEndDate : Date;
  private successCount : number = 0; //number of successful requests
  updateTimeout;

  constructor(
    private squacApi: SquacApiService
  ) {}

  ngOnDestroy(){
    clearTimeout(this.updateTimeout);
  }
  
  setWidget(widget : Widget) {
    this.widget = widget;
    if (widget && widget.metrics.length > 0) {
      widget.channelGroup.channels.forEach(channel => {
        this.localData[channel.id] = {};
        widget.metrics.forEach(metric => {
          this.localData[channel.id][metric.id] = [];
        });
      });
    }
  }

  //some sort of timer that gets the data and 
  updateMeasurement(){
    this.updateTimeout = setTimeout(()=>{
      console.log("timeout");
      this.fetchMeasurements(this.lastEndDate, new Date());
    }, this.refreshInterval);
  }

  fetchMeasurements(start: Date, end:Date) : void {

    const startString = formatDate(start, 'yyyy-MM-ddTHH:mm:ssZ', 'en-GB');
    const endString = formatDate(end, 'yyyy-MM-ddTHH:mm:ssZ', 'en-GB');
    if(this.widget && this.widget.metrics.length > 0) {
      this.getMeasurements(startString, endString).subscribe(
        success => {
          //there is new data, update.
          if(success.length > 0){
            this.successCount++;
            this.data.next(this.localData);
          } else if(this.successCount === 0) {
            this.data.next({});
          } else {
            //do nothing - no new data
          }
        },
        error => {
          console.log("error in fetch measurements")
        },
        () =>{
          this.lastEndDate = end;
          this.updateMeasurement();
          console.log("completed get data for " + this.widget.id);
        }
      );
    }
  }

  private getMeasurements(starttime: string, endtime: string ): Observable<any> {
    return this.squacApi.get(this.url, null,
      {
          metric: this.widget.metricsString,
          group: this.widget.channelGroup.id,
          starttime,
          endtime,
      }
    ).pipe(
      map(response => {
        response.forEach(m => {
          this.localData[m.channel][m.metric].push(
            new Measurement(
              m.id,
              m.user_id,
              m.metric,
              m.channel,
              m.value,
              m.starttime,
              m.endtime
            )
          );
        });
        return response;
      })
    );
  }
}
