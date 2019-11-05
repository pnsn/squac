import { Component, OnInit, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Measurement } from 'src/app/widgets/measurement';
import { Metric } from 'src/app/shared/metric';
import { Channel } from 'src/app/shared/channel';

@Component({
  selector: 'app-timeseries',
  templateUrl: './timeseries.component.html',
  styleUrls: ['./timeseries.component.scss']
})
export class TimeseriesComponent implements OnInit {
  @Input() dataUpdate: Subject<any>;
  @Input() metrics: Metric[];
  @Input() channels: Channel[];
  @Input() resize: Subject<boolean>;
  subscription = new Subscription();
  results: Array<any>;

  xAxisLabel = 'Measurement Start Date';
  yAxisLabel: string;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor() { }

  ngOnInit() {
    this.subscription.add(this.dataUpdate.subscribe(data => {
      this.buildChartData(data);
    }));
  }

  buildChartData(data) {
    this.results = [];
    const currentMetric = this.metrics[0];
    this.yAxisLabel = currentMetric.name;
    this.channels.forEach(
      channel => {
        const channelObj = {
          name : channel.nslc,
          series : []
        };

        data[channel.id][currentMetric.id].forEach(
          (measurement: Measurement) => {
            channelObj.series.push(
              {
                name: measurement.starttime,
                value: measurement.value
              }
            );
          }
        );

        this.results.push(channelObj);
      }
    );
  }
}
