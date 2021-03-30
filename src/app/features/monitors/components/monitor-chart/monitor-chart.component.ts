import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Metric } from '@core/models/metric';
import { SquacApiService } from '@core/services/squacapi.service';
import { Trigger } from '@features/monitors/models/trigger';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-monitor-chart',
  templateUrl: './monitor-chart.component.html',
  styleUrls: ['./monitor-chart.component.scss']
})
export class MonitorChartComponent implements OnInit, OnChanges {
  @Input() metric?: Metric;
  @Input() triggers: Trigger[];
  @Input() channelGroupId: number;
  locale;
  private url = 'measurement/measurements/';
  constructor(    private squacApi: SquacApiService) {
    this.locale =  {
      format: 'YYYY-MM-DDTHH:mm:ss[Z]',
      displayFormat: 'YYYY/MM/DD HH:mm',
      direction: 'ltr'
    };
   }
  results: Array<any> = [];
  hasData: boolean;
  referenceLines: any[] = [];
  xAxisLabel = 'Last Ten Measurements';
  yAxisLabel = '';
  currentMetric: Metric;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  ngOnInit(): void {
  }
  // this is functionally a widget - should have a measurement service?

  ngOnChanges(changes: SimpleChanges): void {
    //only update data if these change
    if ((changes.metric || changes.channelGroupId) &&  this.metric && this.channelGroupId) {
      this.getData(this.metric, this.channelGroupId);
    }

    //only update triggers when they change
    if(changes.triggers) {
      this.addTriggers();
    }
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

  // ToDo: put in service so locale and squac aren't in here
  getData(metric: Metric, channelGroupId){
    console.log("getting data")
    const data = {};
    this.results = [];
    this.hasData = false;
    this.yAxisLabel = this.metric.unit;
    // try to get x datapoints
    const rate = metric.sampleRate;
    const numMeasurements = 10;

    const starttime = moment().utc().subtract(rate * numMeasurements, 'seconds').format(this.locale.format);
    const endtime = moment().utc().format(this.locale.format);
    // calculate starttime
    this.squacApi.get(this.url, null,
      {
          metric: metric.id,
          group: channelGroupId,
          starttime,
          endtime,
      }
    ).pipe(
      map(response => {
        response.forEach(m => {
          if (!data[m.channel]) {
            data[m.channel] = [];
          }
          data[m.channel].push(
            {
              name : moment.utc(m.starttime).toDate(),
              value : m.value
            }
          );
        });
        return data;
      })
    ).subscribe(
      result => {
        for (const channel in result) {
          if (channel && data[channel]) {
            this.results.push({
              name : channel,
              series : data[channel]
            });
          }
        }
        // console.log('resultts', this.results);
        this.hasData = this.results.length > 0;
      }
    );
  }

  formatData() {

  }
}
