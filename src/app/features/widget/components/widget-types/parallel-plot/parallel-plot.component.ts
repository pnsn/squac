import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Channel } from "@core/models/channel";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "@features/widget/models/threshold";
import { Widget } from "@features/widget/models/widget";
import { MeasurementPipe } from "@features/widget/pipes/measurement.pipe";
import { Subscription } from "rxjs";

@Component({
  selector: "widget-parallel-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
  providers: [MeasurementPipe],
})
export class ParallelPlotComponent implements OnInit {
  constructor(private measurementPipe: MeasurementPipe) {}
  @Input() widget: Widget;
  @Input() data;
  metrics: Metric[];
  rows = [];
  thresholds: { [metricId: number]: Threshold };
  channelGroup: ChannelGroup;
  schema = [];
  channels: Channel[] = [];
  subscription = new Subscription();
  results: Array<any>;
  hasData: boolean;
  referenceLines;
  xAxisLabel = "Measurement Start Date";
  yAxisLabel: string;
  currentMetric: Metric;
  colorScheme = {
    domain: ["#5AA454", "#A10A28", "#C7B42C", "#AAAAAA"],
  };
  options = {};
  updateOptions = {};
  xScaleMin;
  xScaleMax;
  yScaleMin;
  yScaleMax;
  initOptions = {};

  // Max allowable time between measurements to connect
  maxMeasurementGap: number = 1 * 1000;
  test = 0;

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.data && this.channels.length > 0) {
      // this.buildChartData(this.data);
      console.log("data changed");
    }
  }
  ngOnInit(): void {
    this.metrics = this.widget.metrics;

    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    if (this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }
    this.buildRows(this.data);

    console.log("init");
    // this.buildRows(this.data);
    // const pieces = this.addThresholds();
    // console.log(pieces);
    // const legendOffset = //pieces.length;

    this.options = {
      grid: {
        containLabel: true,
        left: "30",
        right: "15%",
        bottom: "30",
      },
      useUtc: true,
      tooltip: {
        padding: 10,
        borderColor: "#777",
        borderWidth: 1,
        formatter: (params) => {
          let str = params.seriesName + "<br />";
          str += "StatType: " + this.widget.stattype.type + "";
          str += "<table><th>Metric</th> <th>Value</th>";
          params.data.forEach((data, i) => {
            str +=
              "<tr><td>" +
              this.schema[i].name +
              "</td><td>" +
              data +
              "</td></tr>";
          });
          str = str += "</br>";
          return str;
        },
      },
      parallel: {
        parallelAxisDefault: {
          type: "value",
          nameLocation: "end",
          nameGap: 20,
          nameTextStyle: {
            color: "#fff",
            fontSize: 12,
          },
          axisLine: {
            lineStyle: {
              color: "#aaa",
            },
          },
          axisTick: {
            lineStyle: {
              color: "#777",
            },
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: "#fff",
          },
        },
      },
      dataZoom: [],
      series: [],
    };
  }

  // addThresholds(): Array<any> {
  //   const pieces = [];
  //   if (this.thresholds[this.currentMetric.id]) {
  //     const piece = {};
  //     // thresholds.forEach((threshold)=>{  }) //allow multople
  //     const threshold = this.thresholds[this.currentMetric.id];
  //     if (threshold.min || threshold.min === 0) {
  //       piece["min"] = threshold.min;
  //     }
  //     if (threshold.max || threshold.max === 0) {
  //       piece["max"] = threshold.max;
  //     }
  //     piece["color"] = "#AA069F";
  //     pieces.push(piece);
  //   }

  //   return pieces;
  // }

  private buildRows(data) {
    const series = [];
    const parallelAxis = [];
    this.channels.forEach((channel, chanIndex) => {
      const channelSeries = {
        name: channel.nslc,
        type: "parallel",
        lineStyle: {
          width: 1,
          opacity: 0.5,
        },
        data: [],
        large: true,
      };
      const channelData = [];
      this.metrics.forEach((metric, i) => {
        if (chanIndex === 0) {
          parallelAxis.push({
            name: metric.name,
            dim: i,
            data: [metric.name],
            min: null,
            max: null,
          });
        }

        const statType = this.widget.stattype.type;

        let val: number = null;

        if (data[channel.id] && data[channel.id][metric.id]) {
          const rowData = data[channel.id][metric.id];
          val = rowData[0].value;
        }
        if (val !== null && parallelAxis[i].min === null) {
          parallelAxis[i].min = val; //1.01 to add a buffer
          parallelAxis[i].max = val;
        } else if (val !== null && val < parallelAxis[i].min) {
          parallelAxis[i].min = val;
        } else if (val !== null && val > parallelAxis[i].max) {
          parallelAxis[i].max = val;
        }

        channelData.push(val);
      });
      channelSeries.data.push(channelData);
      series.push(channelSeries);
    });

    parallelAxis.forEach((p, i) => {
      p.min = Math.round(p.min * 10) / 10;
      p.max = Math.round(p.max * 10) / 10;
    });

    this.updateOptions = {
      series: series,
      parallelAxis: parallelAxis,
    };
    this.schema = [...parallelAxis];
  }
}
