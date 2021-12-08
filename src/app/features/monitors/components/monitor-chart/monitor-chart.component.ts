import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Metric } from '@core/models/metric';
import { Trigger } from '@features/monitors/models/trigger';
import { ApiGetAggregate } from '@features/widgets/models/aggregate';
import { MeasurementsService } from '@features/widgets/services/measurements.service';
import * as moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-monitor-chart',
  templateUrl: './monitor-chart.component.html',
  styleUrls: ['./monitor-chart.component.scss']
})
export class MonitorChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() metric?: Metric;
  @Input() triggers: Trigger[];
  @Input() channelGroupId: number;
  @Input() stat: string;
  @Input() numberChannels: number;
  @Input() intervalCount: number;
  @Input() intervalType: string;
  @Input() invert: boolean;

  locale;
  private url = 'measurement/measurements/';
  constructor(    private measurementService: MeasurementsService) {
    this.locale =  {
      format: 'YYYY-MM-DDTHH:mm:ss[Z]',
      displayFormat: 'YYYY/MM/DD HH:mm',
      direction: 'ltr'
    };
   }
  results: Array<any> = [];
  hasData: boolean;
  referenceLines: any[] = [];
  xAxisLabel = 'Last Ten Monitor Values';
  yAxisLabel = '';
  currentMetric: Metric;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  responseCache;
  indexes;
  requests: Observable<any>;
  ngOnInit(): void {
  }
  // this is functionally a widget - should have a measurement service?

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
  }

  ngOnChanges(changes: SimpleChanges): void {
    // only update data if these change -> swap values if interval changes too
    if ((changes.metric || changes.channelGroupId || changes.intervalCount || changes.intervalType) &&
          this.metric && this.channelGroupId &&
          this.intervalCount && this.stat && this.intervalType) {
          this.getData();
    } else if (changes.stat && this.stat) {
      this.recalculateStat();
    }

    // only update triggers when they change
    if (changes.triggers) {
      this.addTriggers();
    }
    this.getAxisLabel();
  }

  addTriggers() {
    this.referenceLines = [];
    this.triggers?.forEach(( trigger ) => {
      if (trigger.max !== null) {
        this.referenceLines.push(
          {
            name: `max: ` + trigger.max,
            value: trigger.max
          }
        );
      }
      if (trigger.min !== null) {
        this.referenceLines.push(
          {
            name: `min: ` + trigger.min,
            value: trigger.min
          }
        );
      }
    });
  }


// date formatting used in charts
  xAxisTickFormatting(value) {
  let formatOptions;
  if (value.getSeconds() !== 0) {
    formatOptions = { second: '2-digit' };
  } else if (value.getMinutes() !== 0) {
    formatOptions = { hour: '2-digit', minute: '2-digit' };
  } else if (value.getHours() !== 0) {
    formatOptions = { hour: '2-digit' , minute: '2-digit'};
  } else if (value.getDate() !== 1) {
    formatOptions = value.getDay() === 0 ? { month: 'short', day: '2-digit' } : { month: 'short', day: '2-digit' };
  } else if (value.getMonth() !== 0) {
    formatOptions = { month: 'long' };
  } else {
    formatOptions = { year: 'numeric' };
  }
  formatOptions.hour12 = false;
  formatOptions.timeZone = 'UTC';
  return new Intl.DateTimeFormat('en-US', formatOptions).format(value);
}
  recalculateStat() {
    console.log('update stat');
    if (this.responseCache) {
      const data = this.mapResponse(this.responseCache, {});
      this.toChartData(data);
    }
  }

  getAxisLabel(){
    let label = '';
    if (this.stat === 'count') {
      label = 'count';
    } else {
      label = this.stat + ' of ' + this.metric.unit;
    }
    this.yAxisLabel = label ;
  }
  // ToDo: put in service so locale and squac aren't in here
  getData(){
    console.log('getting data');
    const data = {};
    this.indexes = [];
    this.hasData = false;
    // count, sum, avg, min, max
    // ['minute', 'hour', 'day'];
    const duration = moment.duration({ [this.intervalType] : this.intervalCount});
    const numHours = 10; // number of monitor evaluations to show

    const requests = [];
    const endtime = moment().utc().startOf('hour'); // last time alarms would have ran
    for (let i = 0; i < numHours; i++) {
      const starttime = endtime.clone().subtract(duration);

      const startString = starttime.clone().format(this.locale.format);
      const endString = endtime.clone().format(this.locale.format);
      requests.push(
        this.measurementService.getAggregated(
          {
              metric: this.metric.id.toString(),
              group: this.channelGroupId,
              starttime: startString,
              endtime: endString
          }
      ));
      this.indexes.push(endtime.clone());
      endtime.subtract(1, 'hour');
    }

    forkJoin(requests).pipe(
      map(r => this.mapResponse(r, data))
    ).subscribe(d => this.toChartData(d));
  }

  toChartData(data) {
    this.results = [];
    for (const channel in data) {
        if (channel && data[channel]) {
          this.results.push({
            name : channel,
            series : data[channel]
          });
        }
      }
    this.hasData = this.results.length > 0;
  }

  mapResponse(response, data) {
    this.responseCache = response;
    response.forEach((values: Array<any>, i) => {
      values.forEach(m => {
        if (!data[m.channel]) {
          data[m.channel] = [];
        }
        data[m.channel].push(
          {
            name : this.indexes[i].toDate(),
            value : this.getValue(m)
          }
        );
      });
    });
    return data;
  }

  getValue(agg: ApiGetAggregate): number {
    let value: number;
    // count, sum, avg, min, max
    switch (this.stat) {
      case 'count':
        value = agg.num_samps;
        break;

      case 'sum':
        value = agg.mean * agg.num_samps;
        break;
      case 'avg':
        value = agg.mean;
        break;
      case 'min':
        value = agg.min;
        break;
      case 'max':
        value = agg.max;
        break;

      default:
        value = 0;
        break;
    }

    return value;
  }
}
