import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Widget } from '@features/widgets/models/widget';
import { SquacApiService } from '@core/services/squacapi.service';
import { MeasurementAdapter } from '../models/measurement';
import { map } from 'rxjs/operators';

export class MeasurementHttpData {
  metric: string;
  group: number;
  starttime: string;
  endtime: string;
}
@Injectable({
  providedIn: "root"
})
export class MeasurementsService {
  private url = 'measurement/';
  updateTimeout;
  locale;

  constructor(
    private squacApi: SquacApiService,
    private measurementAdapter : MeasurementAdapter
  ) {
    console.log("I exist");
  }

  // sets up data storage
  private initLocalData(widget) {
    const data = {};
    if (widget && widget.metrics && widget.metrics.length > 0 && widget.channelGroup.channels) {
      widget.channelGroup.channels.forEach(channel => {
        data[channel.id] = {};
        widget.metrics.forEach(metric => {
          data[channel.id][metric.id] = [];
        });
      });
      return data;
    }
  }

  getData(starttime: string, endtime: string, widget: Widget, archiveType?: string) {
    const data = this.initLocalData(widget);
    const params = {
      metric: widget.metricsString,
      group: widget.channelGroup.id,
      starttime,
      endtime,
    }
    if(archiveType) {
      return this.getArchive(starttime, endtime, archiveType).pipe(
        map()
      );
    } else if (widgetType === 1 || widgetType === 4) {
      return this.getAggregated(starttime, endtime);
    } else {
      return this.getMeasurements(starttime, endtime);
    }
  }

  // Get measurements from squac
  private getMeasurements(starttime: string, endtime: string, params : MeasurementHttpData): Observable<any> {
    return this.squacApi.get(this.url + "measurements", null, params);
  }

  // Get measurement aggregate from squac
  private getAggregated(starttime: string, endtime: string , params : MeasurementHttpData): Observable<any> {
    return this.squacApi.get(this.url + "aggregated", null, params
    );
  }

  // Get measurement aggregate from squac
  private getArchive(starttime: string, endtime: string, archiveType: string, params : MeasurementHttpData): Observable<any> {
    return this.squacApi.get(this.url + archiveType + "-archives", null, params);
  }
}
