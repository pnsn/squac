import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Measurement } from '../models/measurement';
import { Widget } from '@features/widgets/models/widget';
import { SquacApiService } from '@core/services/squacapi.service';
import * as moment from 'moment';
import { ViewService } from '@core/services/view.service';
import { ConfigurationService } from '@core/services/configuration.service';

interface MeasurementsHttpData {
  name: string;
  description: string;
  url: string;
  unit: string;
  id?: number;
}

@Injectable()
export class MeasurementsService implements OnDestroy {
  private url = 'measurement/measurements/';
  data = new Subject();
  private localData = {};
  private widget;
  private refreshInterval;
  private lastEndString: string;
  private successCount = 0; // number of successful requests
  updateTimeout;
  private measurementSubscription;
  constructor(
    private squacApi: SquacApiService,
    private viewService: ViewService,
    private configService: ConfigurationService
  ) {
    this.refreshInterval = configService.getValue('dataRefreshIntervalMinutes', 4);
  }

  ngOnDestroy() {
    if(this.measurementSubscription){
      this.measurementSubscription.unsubscribe();
    }

    clearTimeout(this.updateTimeout);
  }

  setWidget(widget: Widget) {
    this.widget = widget;
    if (widget && widget.metrics && widget.metrics.length > 0) {
      widget.channelGroup.channels.forEach(channel => {
        this.localData[channel.id] = {};
        widget.metrics.forEach(metric => {
          this.localData[channel.id][metric.id] = [];
        });

      });
    }
  }

  // TODO: needs to truncate old measurement
  fetchMeasurements(startString?: string, endString?: string): void {

    let start, end;
    if(!startString || !endString) {
      start = this.viewService.getStartdate();
      end = this.viewService.getEnddate();
    } else {
      start = startString;
      end = endString;
    }
    if (this.widget && this.widget.metrics && this.widget.metrics.length > 0) {
      this.viewService.widgetStartedLoading();
      this.measurementSubscription = this.getMeasurements(start, end).subscribe(
        success => {
          // there is new data, update.
          if (success.length > 0) {
            this.successCount++;
            this.data.next(this.localData);
          } else if (this.successCount === 0) {
            this.data.next({});
          } else {
            // do nothing - no new data
          }
        },
        error => {
          console.log(error);
          console.log('error in fetch measurements');
        },
        () => {
          this.viewService.widgetFinishedLoading();
          this.lastEndString = end;
          this.updateMeasurement();
          console.log('completed get data for ' + this.widget.id);
        }
      );
    } else {
      this.data.next({});
    }
  }

  // some sort of timer that gets the data and
  private updateMeasurement() {
    if (this.viewService.isLive) {
      this.updateTimeout = setTimeout(() => {
        console.log("timeout")
        this.fetchMeasurements(this.lastEndString, moment().utc().format('YYYY-MM-DDTHH:mm:ss[Z]'));
      }, this.refreshInterval * 60 * 1000);
    }
  }

  // Get measurements from squac
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
