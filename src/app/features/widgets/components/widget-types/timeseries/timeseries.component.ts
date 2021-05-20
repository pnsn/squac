import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Metric } from '@core/models/metric';
import { Channel } from '@core/models/channel';
import { ViewService } from '@core/services/view.service';
import { ChannelGroup } from '@core/models/channel-group';
import { Widget } from '@features/widgets/models/widget';
import { Threshold } from '@features/widgets/models/threshold';
import { Measurement } from '@features/widgets/models/measurement';
import * as moment from 'moment';
import * as d3 from 'd3';
import { Archive } from '@features/widgets/models/archive';

@Component({
  selector: 'app-timeseries',
  templateUrl: './timeseries.component.html',
  styleUrls: ['./timeseries.component.scss'],
})
export class TimeseriesComponent implements OnInit, OnDestroy {
  constructor(private viewService: ViewService) {}
  @Input() widget: Widget;
  @Input() data;
  metrics: Metric[];
  thresholds: { [metricId: number]: Threshold };
  channelGroup: ChannelGroup;

  channels: Channel[];
  subscription = new Subscription();
  results: Array<any>;
  hasData: boolean;
  referenceLines;
  xAxisLabel = 'Measurement Start Date';
  yAxisLabel: string;
  currentMetric: Metric;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  xScaleMin;
  xScaleMax;
  yScaleMin;
  yScaleMax;
  @ViewChild('timeSeriesDivIdentifier')
  timeSeriesDivIdentifier: ElementRef;

  onScroll = (event: any) => {};

  // ngOnChanges(changes: SimpleChanges) {
  //   for (const propName in changes) {
  //     const chng = changes[propName];
  //     const cur  = JSON.stringify(chng.currentValue);
  //     const prev = JSON.stringify(chng.previousValue);
  //     console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
  //   }
  // }

  ngOnInit() {
    this.xScaleMin = this.viewService.startdate;
    this.xScaleMax = this.viewService.enddate;
    this.yScaleMax = 0;
    this.yScaleMin = 0;
    this.metrics = this.widget.metrics;
    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    this.currentMetric = this.metrics[0];
    this.onScroll = this.onWheel;
    this.referenceLines = [];
    if (this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }
    if (this.currentMetric) {
      this.buildChartData(this.data);
    }
    const resizeSub = this.viewService.resize.subscribe(
      (widgetId) => {
        if (!widgetId || widgetId === this.widget.id) {
          this.resize();
        }
      },
      (error) => {
        console.log('error in timeseries resize: ' + error);
      }
    );

    this.subscription.add(resizeSub);
  }
  @HostListener('wheel', ['$event'])
  onWheel(event) {
    event.preventDefault();

    const height = this.timeSeriesDivIdentifier.nativeElement.offsetHeight;
    let yScaleMaxChange = 0;
    let yScaleMinChange = 0;
    if (event.deltaY > 0) {
      yScaleMaxChange = -event.deltaY * 10 * (event.layerY / height) * 2;
      yScaleMinChange =
        event.deltaY * 10 * ((height - event.layerY) / height) * 2;
    }
    if (event.deltaY < 0) {
      yScaleMaxChange =
        -event.deltaY * 10 * ((height - event.layerY) / height) * 2;
      yScaleMinChange = event.deltaY * 10 * (event.layerY / height) * 2;
    }

    this.yScaleMax +=
      this.yScaleMax + yScaleMaxChange < 0 ? 0 : yScaleMaxChange;
    this.yScaleMin +=
      this.yScaleMin + yScaleMinChange > 0 ? 0 : yScaleMinChange;

    this.resize();
  }

  private resize() {
    this.results = [...this.results];
  }

  addThresholds() {
    const threshold = this.thresholds[this.currentMetric.id];
    if (threshold) {
      if (threshold.min) {
        this.referenceLines.push({
          name: 'Min Threshold',
          value: threshold.min,
        });
      }

      if (threshold.max) {
        this.referenceLines.push({
          name: 'Max Threshold',
          value: threshold.max,
        });
      }
    }
  }

  xAxisTickFormatting(value) {
    let formatOptions;
    if (value.getSeconds() !== 0) {
      formatOptions = { second: '2-digit' };
    } else if (value.getMinutes() !== 0) {
      formatOptions = { hour: '2-digit', minute: '2-digit' };
    } else if (value.getHours() !== 0) {
      formatOptions = { hour: '2-digit', minute: '2-digit' };
    } else if (value.getDate() !== 1) {
      formatOptions =
        value.getDay() === 0
          ? { month: 'short', day: '2-digit' }
          : { month: 'short', day: '2-digit' };
    } else if (value.getMonth() !== 0) {
      formatOptions = { month: 'long' };
    } else {
      formatOptions = { year: 'numeric' };
    }
    formatOptions.hour12 = false;
    formatOptions.timeZone = 'UTC';
    return new Intl.DateTimeFormat('en-US', formatOptions).format(value);
  }

  buildChartData(data) {
    let max = Number.MIN_VALUE;
    let min = Number.MAX_VALUE;

    this.hasData = false;
    this.results = [];


    this.addThresholds();

    this.yAxisLabel = this.currentMetric.name ? this.currentMetric.name : 'Unknown';
    this.channels.forEach(

      channel => {
        const channelObj = {
          name : channel.nslc,
          series : []
        };

        let rowHasData = false;
        if (data[channel.id] && data[channel.id][this.currentMetric.id]) {
        rowHasData = data[channel.id][this.currentMetric.id].length > 0;

        data[channel.id][this.currentMetric.id].forEach(
          (measurement: Measurement) => {
            if (measurement.value > max) {
              max = measurement.value;
            }
            if (measurement.value < min) {
              min = measurement.value;
            }

            if (channelObj.series.length > 0 &&
              channelObj.series[channelObj.series.length - 1].name.getTime() !==
              moment.utc(measurement.starttime).toDate().getTime() - this.currentMetric.sampleRate * 1000) {
              this.results.push({name: channelObj.name, series: channelObj.series});
              channelObj.series = [];
            }

            channelObj.series.push(
              {
                name: moment.utc(measurement.starttime).toDate(),
                value: measurement.value
              }
            );

          }

        );
        // console.log(channelObj);
        this.hasData = !this.hasData ? data[channel.id][this.currentMetric.id].length > 0 : this.hasData;
        if (channelObj.series.length > 0) {
          this.results.push(channelObj);
        }

      }

    );

    this.hasData = !this.hasData ? rowHasData : this.hasData;
    this.yScaleMax = Math.round(max) + 100;
    this.yScaleMin = Math.round(min) - 100;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
