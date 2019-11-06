import { Component, OnInit, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Measurement } from 'src/app/widgets/measurement';
import { Metric } from 'src/app/shared/metric';
import { Channel } from 'src/app/shared/channel';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/shared/view.service';

@Component({
  selector: 'app-timeseries',
  templateUrl: './timeseries.component.html',
  styleUrls: ['./timeseries.component.scss']
})
export class TimeseriesComponent implements OnInit {
  @Input() metrics: Metric[];
  channels:Channel[];
  subscription = new Subscription();
  results: Array<any>;
  hasData : Boolean;
  xAxisLabel = 'Measurement Start Date';
  yAxisLabel: string;
  currentMetric: Metric;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor(
    private dataFormatService : DataFormatService,
    private viewService : ViewService
  ) { }

  ngOnInit() {
    const dateFormatSub = this.dataFormatService.formattedData.subscribe(
      response => {
        if(response) {
          console.log(response);
          this.channels = this.viewService.getChannelGroup().channels;
          this.currentMetric = this.metrics[0]; //TODO: get this a diffetent way
          this.buildChartData(response);
        }
      }
    );

    this.subscription.add(dateFormatSub);
  }

  buildChartData(data) {
    this.hasData = false;
    this.results = [];

    this.yAxisLabel = this.currentMetric.name;
    this.channels.forEach(
      channel => {
        const channelObj = {
          name : channel.nslc,
          series : []
        };

        data[channel.id][this.currentMetric.id].forEach(
          (measurement: Measurement) => {
            channelObj.series.push(
              {
                name: measurement.starttime,
                value: measurement.value
              }
            );
          }
        );
        
        this.hasData = !this.hasData ? data[channel.id][this.currentMetric.id].length > 0: this.hasData;

        this.results.push(channelObj);
      }
    );
    console.log(this.results)
  }
}
