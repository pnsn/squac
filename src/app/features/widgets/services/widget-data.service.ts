import { Injectable, OnDestroy } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { ViewService } from '@core/services/view.service';
import { Subject, Subscription } from 'rxjs';
import { Widget } from '../models/widget';
import { MeasurementsService } from './measurements.service';
import * as moment from 'moment';
@Injectable()
export class WidgetDataService implements OnDestroy {
  data = new Subject();
  private widget : Widget;
  private refreshInterval;
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
  }
    // TODO: needs to truncate old measurement
    fetchMeasurements(startString?: string, endString?: string): void {
      this.clearTimeout();
      let start;
      let end;
      if (!startString || !endString) {
        start = this.viewService.startdate;
        end = this.viewService.enddate;

        // clear data
      } else {
        start = startString;
        end = endString;
      }
      const archiveType = this.viewService.archiveType;
      const archiveStat = this.viewService.archiveStat;
      if (this.widget && this.widget.metrics && this.widget.metrics.length > 0) {
        this.viewService.widgetStartedLoading();
        const measurementSub = this.measurementsService
          .getData(start, end, this.widget, archiveType, archiveStat).subscribe(
          success => {
            this.data.next(success);
          },
          error => {
            console.log(error);
            console.log('error in fetch measurements');
          },
          () => {
            this.viewService.widgetFinishedLoading();
            this.updateMeasurement();
          }
        );
  
        this.subscription.add(measurementSub);
      } else {
        this.data.next({});
      }
    }

  
    // Clears any active timeout
    private clearTimeout() {
      if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
      }
    }

    // FIXME: needs to get new range
    // some sort of timer that gets the data and
    private updateMeasurement() {
      if (this.viewService.isLive) {
        this.updateTimeout = setTimeout(() => {
          this.fetchMeasurements(moment().subtract(this.viewService.range, 'seconds').utc().format(this.locale.format), moment().utc().format(this.locale.format));
        }, this.refreshInterval * 60 * 1000);
      }
    }

}