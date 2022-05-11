import { Component, Input, OnInit } from "@angular/core";
import { Channel } from "@core/models/channel";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "@features/widget/models/threshold";
import { WidgetTypeComponent } from "../widget-type.component";

@Component({
  selector: "widget-scatter-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.html"],
})
export class ScatterPlotComponent implements OnInit, WidgetTypeComponent {
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: { [metricId: number]: Threshold };
  @Input() channels: Channel[];
  @Input() dataRange: any;
  initOptions: any;
  options: any;
  autoResize: any;
  updateOptions: any;
  constructor() {}

  ngOnInit(): void {}
  onChartEvent(event, type) {
    console.log(event.seriesName, type);
  }
}
