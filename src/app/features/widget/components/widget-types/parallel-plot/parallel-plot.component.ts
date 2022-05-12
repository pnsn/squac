import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Channel } from "@core/models/channel";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "@features/widget/models/threshold";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { Subscription } from "rxjs";
import { WidgetTypeComponent } from "../widget-type.component";

@Component({
  selector: "widget-parallel-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
  providers: [WidgetTypeService],
})
export class ParallelPlotComponent implements OnInit, WidgetTypeComponent {
  constructor(private widgetTypeService: WidgetTypeService) {}
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: { [metricId: number]: Threshold };
  @Input() channels: Channel[];
  @Input() dataRange: any;
  schema = [];
  subscription = new Subscription();
  results: Array<any>;
  options = {};
  updateOptions = {};
  initOptions = {};

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.data && this.channels.length > 0) {
      this.buildRows(this.data);
    }
  }
  ngOnInit(): void {
    this.options = {
      parallel: {
        left: "30",
        right: "200", //changes with legend or mapping
      },
      grid: {
        containLabel: true,
        left: "40",
        // right: "80",
        // bottom: "80",
      },
      useUtc: true,
      legend: {
        show: false,
        type: "scroll",
        orient: "vertical",
        align: "left",
        left: "right",
        selector: ["all", "inverse"],
      },
      animation: false,
      tooltip: {
        position: function (pt) {
          return [pt[0], "10%"];
        },
        confine: true,
        formatter: this.widgetTypeService.multiMetricTooltipFormatting,
      },
      dataZoom: [],
      series: [],
      toolbox: {
        show: true,
        showTitle: true,
        feature: {
          dataView: {
            show: true,
          },
          myChannelToggle: {
            show: true,
            title: "Toggle Channel List",
            icon: "path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891",
            onclick: () => {
              this.toggleLegend();
            },
          },
        },
      },
    };
  }
  toggleLegend() {}

  onChartEvent(event, type) {
    console.log(event.seriesName, type);
  }

  private buildRows(data) {
    const metricSeries = {
      type: "parallel",
      colorBy: "data",
      data: [],
      large: true,
      dimensions: [],
    };
    // const visualMaps = this.widgetTypeService.getVisualMapFromThresholds(
    //   this.metrics,
    //   this.thresholds,
    //   this.dataRange
    // );
    const processedData = this.widgetTypeService.getSeriesForMultipleMetrics(
      this.metrics,
      this.channels,
      data,
      metricSeries
    );

    this.updateOptions = {
      series: processedData.series,
      parallelAxis: processedData.axis,
      parallel: {
        parallelAxisDefault: {
          nameTextStyle: {
            width: 15,
            overflow: "break",
          },
        },
      },
    };
  }
}
