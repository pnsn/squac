import { Component, Input, OnInit } from "@angular/core";
import { Channel } from "@core/models/channel";
import { ChannelGroup } from "@core/models/channel-group";
import { Metric } from "@core/models/metric";
import { Threshold } from "@features/widget/models/threshold";
import { WidgetTypeComponent } from "../widget-type.component";

@Component({
  selector: "widget-box-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
})
export class BoxPlotComponent implements OnInit, WidgetTypeComponent {
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: { [metricId: number]: Threshold };
  @Input() channels: Channel[];
  @Input() currentMetricId: number;
  initOptions: any;
  options: any;
  autoResize: any;
  updateOptions: any;
  constructor() {}

  ngOnInit(): void {}
}
