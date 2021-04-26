import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Widget } from '@features/widgets/models/widget';
import { SquacApiService } from '@core/services/squacapi.service';
import { ApiGetMeasurement, Measurement, MeasurementAdapter } from '../models/measurement';
import { map } from 'rxjs/operators';
import { ApiGetArchive, Archive, ArchiveAdapter } from '../models/archive';

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

  constructor(
    private squacApi: SquacApiService,
    private measurementAdapter : MeasurementAdapter,
    private archiveAdapter : ArchiveAdapter
  ) {
    console.log("I exist");
  }

  //needs tos end back the data

  getData(starttime: string, endtime: string, widget: Widget, data: any, archiveType?: string) {
    const widgetType = widget.typeId;
    const params = {
      metric: widget.metricsString,
      group: widget.channelGroup.id,
      starttime,
      endtime
    }
    let path;
    if(archiveType) {
      path = archiveType + "-archives";
    } else if (widgetType === 1 || widgetType === 4) {
      path = "aggregated";
    } else {
      path = "measurements";
    }

    return this.squacApi.get(this.url + path, null, params).pipe(
      map(response => {
        response.forEach( m => {
          if(data && data[m.channel] && data[m.channel][m.metric]) {
            const value = path === "measurements" ? this.measurementAdapter.adaptFromApi(m) : this.archiveAdapter.adaptFromApi(m);
            data[m.channel][m.metric].push(value);
          }
        });
        return response;
      })
    );
  }

  // Get measurements from squac
  private getMeasurements(starttime: string, endtime: string, params : MeasurementHttpData): Observable<ApiGetMeasurement[]> {
    return this.squacApi.get(this.url + "measurements", null, params);
  }

  // Get measurement aggregate from squac
  private getAggregated(starttime: string, endtime: string , params : MeasurementHttpData): Observable<ApiGetArchive[]> {
    return this.squacApi.get(this.url + "aggregated", null, params);
  }

  // Get measurement aggregate from squac
  private getArchive(starttime: string, endtime: string, archiveType: string, params : MeasurementHttpData): Observable<ApiGetArchive[]> {
    return this.squacApi.get(this.url + archiveType + "-archives", null, params);
  }
}
