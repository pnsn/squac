import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
export class MonitorChartComponent implements OnInit {
  @Input() metric?: Metric;
  @Input() triggers: Trigger[];
  @Input() channelGroupId: number;
  locale;
  private url = 'measurement/measurements/';
  constructor(    private squacApi: SquacApiService) {
    this.locale =  {
      "format": "YYYY-MM-DDTHH:mm:ss[Z]",
      "displayFormat": "YYYY/MM/DD HH:mm",
      "direction": "ltr"
    };
   }
  results: Array<any> = [];
  hasData: boolean;
  referenceLines: any[] = [];
  xAxisLabel = 'Last Two Weeks';
  yAxisLabel: string =" Example data ";
  currentMetric: Metric;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  ngOnInit(): void {


    console.log(this.referenceLines);
    // this.results = [
    //   {
    //     name: moment.utc(measurement.starttime).toDate(),
    //     value: measurement.value
    //   }
    // ]

    // this.results = [...this.results]
  }

  // this is functionally a widget - should have a measurement service?

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.metric && this.channelGroupId) {
      this.getData(this.metric, this.channelGroupId);
      this.triggers.forEach(( trigger )=> {
        this.referenceLines.push(
          {
            name: `${trigger.id} max`,
            value: trigger.max
          }
        );
        this.referenceLines.push(
          {
            name: `${trigger.id} min`,
            value: trigger.min
          }
        );
  
      });
    }
  }

  //ToDo: put in service so locale and squac aren't in here
  getData(metric : Metric, channelGroupId){
    console.log('get data')
    let data = {};
    this.results = [];
    this.hasData = false;
    //try to get x datapoints
    const rate = metric.sampleRate;
    const numMeasurements = 10;

    const starttime = moment().utc().subtract(rate * numMeasurements, 'seconds').format(this.locale.format)
    const endtime = moment().utc().format(this.locale.format)
    //calculate starttime
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
          if(!data[m.channel]) {
            data[m.channel] = [];
          } 
          data[m.channel].push(
            {
              "name" : m.starttime,
              "value" : m.value
            }
          );
        });
        return data;
      })
    ).subscribe(
      result => {        
        for(let channel in result) {
          this.results.push({
            "name" : channel,
            "series" : data[channel]
          });
        }
        console.log("resultts", this.results)
        this.hasData = this.results.length > 0;
      }
    );
  }

  formatData() {

  }
}
