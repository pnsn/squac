import { Component } from "@angular/core";
import { Channel } from "@squacapi/models/channel";
import { Metric } from "@squacapi/models/metric";
import { WidgetTypeComponent } from "../widget-type.component";

@Component({
  selector: "widget-box-plot",
  templateUrl: "../e-chart.component.html",
  styleUrls: ["../e-chart.component.scss"],
})

// https://echarts.apache.org/examples/en/editor.html?c=data-transform-aggregate
export class BoxPlotComponent {
  data;
  channels: Channel[];
  selectedMetrics: Metric[];
  properties: any;
  emphasizedChannel: string;
  deemphasizedChannel: string;
  initOptions: any;
  options: any;
  autoResize: any;
  updateOptions: any;
  echartsInstance;
  updateData(d: any): any {}

  onChartEvent(event, type) {
    console.log(event, type);
  }

  onChartInit(event) {
    this.echartsInstance = event;
  }

  zoomStopped(event) {
    console.log(event);
  }
}
