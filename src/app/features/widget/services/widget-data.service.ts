import { Injectable, OnDestroy } from "@angular/core";
import { ConfigurationService } from "@core/services/configuration.service";
import { ViewService } from "@core/services/view.service";
import { Subject, Subscription, map } from "rxjs";
import { Widget } from "../models/widget";
import { MeasurementService } from "./measurement.service";
import { Measurement, MeasurementAdapter } from "../models/measurement";
import { Archive, ArchiveAdapter } from "../models/archive";
import { Aggregate, AggregateAdapter } from "../models/aggregate";
@Injectable()
export class WidgetDataService implements OnDestroy {
  data = new Subject();
  private widget: Widget;
  private refreshInterval;
  updateTimeout;
  locale;
  private subscription: Subscription = new Subscription();

  constructor(
    private viewService: ViewService,
    private measurementService: MeasurementService,
    configService: ConfigurationService,
    private measurementAdapter: MeasurementAdapter,
    private archiveAdapter: ArchiveAdapter,
    private aggregateAdapter: AggregateAdapter
  ) {
    this.refreshInterval = configService.getValue(
      "dataRefreshIntervalMinutes",
      4
    );
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
    const data = {};
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
    const widgetStat = this.widget.stattype.type;

    if (
      this.widget &&
      this.widget.metrics &&
      this.widget.metrics.length > 0 &&
      this.widget.channelGroup
    ) {
      this.viewService.widgetStartedLoading();
      const measurementSub = this.measurementService
        .getData(start, end, this.widget, archiveType)
        .pipe(
          map((response) => {
            console.log(response.length);
            response.forEach((m) => {
              let value: Measurement | Aggregate | Archive;
              if (archiveType && archiveType !== "raw") {
                value = this.archiveAdapter.adaptFromApi(m);
                if (archiveStat) {
                  value.value = value[archiveStat];
                }
              } else if (this.widget.useAggregate) {
                value = this.aggregateAdapter.adaptFromApi(m);
                if (widgetStat) {
                  value.value = value[widgetStat];
                }
              } else {
                value = this.measurementAdapter.adaptFromApi(m);
              }

              if (!data[m.channel]) {
                data[m.channel] = {};
              }
              if (!data[m.channel][m.metric]) {
                data[m.channel][m.metric] = [];
              }

              data[m.channel][m.metric].push(value);
            });
            return data;
          })
        )
        .subscribe({
          next: (data) => {
            this.data.next(data);
          },
          error: () => {
            console.log("error in fetch measurements");
            this.viewService.widgetFinishedLoading();
            this.data.next({});
          },
          complete: () => {
            this.viewService.widgetFinishedLoading();
            this.updateMeasurement();
          },
        });

      this.subscription.add(measurementSub);
    } else {
      this.data.next({});
      this.viewService.widgetFinishedLoading();
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
        this.fetchMeasurements(
          this.viewService.startdate,
          this.viewService.enddate
        );
      }, this.refreshInterval * 60 * 1000);
    }
  }

  //cache some measurement requests
}
