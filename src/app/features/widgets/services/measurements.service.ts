import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Widget } from '@features/widgets/models/widget';
import { SquacApiService } from '@core/services/squacapi.service';
import { MeasurementAdapter } from '../models/measurement';
@Injectable()
export class MeasurementsService {
  private url = 'measurement/';
  data = new Subject();
  private localData = {};
  private widget : Widget;

  updateTimeout;
  locale;

  constructor(
    private squacApi: SquacApiService,
    private measurementAdapter : MeasurementAdapter
  ) {
  }

  // Get measurements from squac
  private getMeasurements(starttime: string, endtime: string ): Observable<any> {
    return this.squacApi.get(this.url + "measurements", null,
      {
          metric: this.widget.metricsString,
          group: this.widget.channelGroup.id,
          starttime,
          endtime,
      }
    );
  }

  // Get measurement aggregate from squac
  private getAggregated(starttime: string, endtime: string ): Observable<any> {
    return this.squacApi.get(this.url + "aggregated", null,
      {
          metric: this.widget.metricsString,
          group: this.widget.channelGroup.id,
          starttime,
          endtime,
      }
    );
  }
}
