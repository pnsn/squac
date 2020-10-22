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

  constructor(
    private squacApi: SquacApiService,
    private viewService: ViewService,
    private configService: ConfigurationService
  ) {
    this.refreshInterval = configService.getValue('dataRefreshIntervalMinutes');
  }

  ngOnDestroy() {
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
  fetchMeasurements(startString: string, endString: string): void {
    this.viewService.widgetStartedLoading();
    if (this.widget && this.widget.metrics && this.widget.metrics.length > 0) {
      this.getMeasurements(startString, endString).subscribe(
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
          this.lastEndString = endString;
          this.updateMeasurement();
          console.log('completed get data for ' + this.widget.id);
        }
      );
    } else {
      // return error somehow
      this.data.next({});
      this.viewService.widgetFinishedLoading();
    }
  }

  // some sort of timer that gets the data and
  private updateMeasurement() {
    if (this.viewService.isLive) {
      this.updateTimeout = setTimeout(() => {
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
