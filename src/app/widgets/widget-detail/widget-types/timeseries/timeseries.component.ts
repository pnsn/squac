import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Measurement } from 'src/app/widgets/measurement';
import { Metric } from 'src/app/shared/metric';
import { Channel } from 'src/app/shared/channel';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/shared/view.service';
import { ChannelGroup } from 'src/app/shared/channel-group';

@Component({
  selector: 'app-timeseries',
  templateUrl: './timeseries.component.html',
  styleUrls: ['./timeseries.component.scss']
})
export class TimeseriesComponent implements OnInit, OnDestroy {
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  subscription = new Subscription();
  results: Array<any>;
  hasData: boolean;
  channels: Channel[];
  xAxisLabel = 'Measurement Start Date';
  yAxisLabel: string;
  currentMetric: Metric;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor(
    private dataFormatService: DataFormatService,
    private viewService: ViewService
  ) { }

  ngOnInit() {

    this.channels = this.channelGroup.channels;
    const dateFormatSub = this.dataFormatService.formattedData.subscribe(
      response => {
        if (response) {
          this.currentMetric = this.metrics[0]; // TODO: get this a diffetent way
          console.log(response);
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

        this.hasData = !this.hasData ? data[channel.id][this.currentMetric.id].length > 0 : this.hasData;

        this.results.push(channelObj);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
