import { Component, OnDestroy } from "@angular/core";
import { WidgetConnectService } from "../services/widget-connect.service";
import { WidgetManagerService } from "../services/widget-manager.service";
import { EChartsOption } from "echarts";
import { GenericWidgetComponent } from "../interfaces/generic-widget.component";
import { WidgetTypeComponent } from "./interfaces/widget-type.interface";

/**
 * Abstract class to make creation of Echart widgets simpler
 */
@Component({ template: "" })
// extends GenericWidgetComponent
export abstract class EChartComponent
  extends GenericWidgetComponent
  implements WidgetTypeComponent, OnDestroy
{
  // abstract buildChartData(data: any): Promise<void>;

  constructor(
    protected widgetManager: WidgetManagerService,
    protected widgetConnector: WidgetConnectService
  ) {
    super(widgetManager, widgetConnector);
  }

  emphasizedChannel: string;
  deemphasizedChannel: string;

  options: any = {};
  updateOptions: EChartsOption = {};
  initOptions: EChartsOption = {};
  echartsInstance: any;
  metricSeries: any = {};

  ngOnDestroy(): void {
    this.echartsInstance = null;
    super.ngOnDestroy();
  }

  onChartEvent(event, type) {
    console.log(event, type);
  }

  toggleKey() {
    if (this.echartsInstance) {
      this.echartsInstance.setOption({
        visualMap: {
          show: this.showKey,
        },
      });
    }
  }

  onChartInit(event) {
    this.echartsInstance = event;
  }

  emphasizeChannel(channel) {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "highlight",
        seriesName: channel,
      });
    }
  }

  deemphasizeChannel(channel) {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "downplay",
        seriesName: channel,
      });
    }
  }

  startZoom() {
    if (this.echartsInstance) {
      if (this.zooming === "start") {
        this.echartsInstance.dispatchAction({
          type: "takeGlobalCursor",
          key: "dataZoomSelect",
          // Activate or inactivate.
          dataZoomSelectActive: true,
        });
      } else {
        this.echartsInstance.dispatchAction({
          type: "takeGlobalCursor",
          key: "dataZoomSelect",
          // Activate or inactivate.
          dataZoomSelectActive: false,
        });
        if (this.zooming === "reset") {
          this.resetZoom();
        }
      }
    }
  }

  resetZoom() {
    this.echartsInstance.dispatchAction({
      type: "dataZoom",
      start: 0,
      end: 100,
    });
  }

  zoomStopped(event) {
    if (event.batch?.length !== 1) {
      this.widgetManager.zoomStatus.next("stop");
    }
  }

  resize(): void {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }
}
