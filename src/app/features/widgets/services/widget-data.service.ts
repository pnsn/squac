import { Injectable, OnDestroy } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { ViewService } from '@core/services/view.service';
import { Subject, Subscription } from 'rxjs';
import { Widget } from '../models/widget';
import { MeasurementsService } from './measurements.service';

@Injectable()
export class WidgetDataService implements OnDestroy {
  private url = 'measurement/';
  data = new Subject();
  private localData = {};
  private widget : Widget;
  private refreshInterval;
  private lastEndString: string;
  private successCount = 0; // number of successful requests
  updateTimeout;
  locale;
  private subscription: Subscription = new Subscription();

  constructor(
    private viewService: ViewService,
    private measurementsService: MeasurementsService,
    configService: ConfigurationService
  ) {
    this.locale = configService.getValue('locale');
    this.refreshInterval = configService.getValue('dataRefreshIntervalMinutes', 4);
    // this.refreshInterval = 0.5;
    const refreshSub = this.viewService.refresh.subscribe(
      refresh => {
        this.fetchMeasurements();
      }
    );

    this.subscription.add(refreshSub);
  }

  ngOnDestroy() {
    this.clearTimeout();
    this.subscription.unsubscribe();
  }

  setWidget(widget: Widget) {
    this.widget = widget;

    //viewservice get archive type and archive value
    // if raw -> use widget preference which will be 
  }

    // TODO: needs to truncate old measurement
    fetchMeasurements(startString?: string, endString?: string): void {
      this.clearTimeout();
      let start;
      let end;
      if (!startString || !endString) {
        start = this.viewService.startdate;
        end = this.viewService.enddate;
  
        this.initLocalData();
        // clear data
      } else {
        start = startString;
        end = endString;
      }
  
      if (this.widget && this.widget.metrics && this.widget.metrics.length > 0) {
        this.viewService.widgetStartedLoading();
        const measurementSub = this.measurementsService
          .getData(start, end, this.widget.typeId, ).subscribe(
          success => {
            // there is new data, update.
            if (success.length > 0) {
              // there is new data
              this.successCount++;
              this.data.next(this.localData);
            } else if (this.successCount === 0) {
              // no data for this request and no data from earlier requests
              this.data.next({});
            } else if (this.successCount > 0){
            // there is data from old request, but none in this new
              this.data.next(this.localData);
  
  
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
          }
        );
  
        this.subscription.add(measurementSub);
      } else {
        this.data.next({});
      }
    }
  
    // sets up data storage
    private initLocalData() {
      if (this.widget && this.widget.metrics && this.widget.metrics.length > 0 && this.widget.channelGroup.channels) {
        this.widget.channelGroup.channels.forEach(channel => {
          this.localData[channel.id] = {};
          this.widget.metrics.forEach(metric => {
            this.localData[channel.id][metric.id] = [];
          });
        });
      }
    }
  
    // Clears any active timeout
    private clearTimeout() {
      if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
      }
    }

  
    // some sort of timer that gets the data and
    private updateMeasurement() {
      if (this.viewService.isLive) {
        this.updateTimeout = setTimeout(() => {
          this.fetchMeasurements(this.lastEndString, moment().utc().format(this.locale.format));
        }, this.refreshInterval * 60 * 1000);
      }
    }
}

// response.forEach(m => {
//   if (this.localData && this.localData[m.channel]) {
//     this.localData[m.channel][m.metric].push(
//       m
//     )
//   }

// });