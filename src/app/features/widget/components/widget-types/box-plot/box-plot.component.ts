import { Component, Input } from "@angular/core";
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

// https://echarts.apache.org/examples/en/editor.html?c=data-transform-aggregate
export class BoxPlotComponent implements WidgetTypeComponent {
  @Input() data;
  @Input() metrics: Metric[];
  @Input() channelGroup: ChannelGroup;
  @Input() thresholds: { [metricId: number]: Threshold };
  @Input() channels: Channel[];
  @Input() currentMetricId: number;
  @Input() dataRange: any;
  initOptions: any;
  options: any;
  autoResize: any;
  updateOptions: any;

  onChartEvent(event, type) {
    console.log(event, type);
  }
}
