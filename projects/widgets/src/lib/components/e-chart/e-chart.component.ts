import { Component, OnDestroy } from "@angular/core";
import { EChartsOption, EChartsType } from "echarts";

import { WidgetConnectService, WidgetManagerService } from "../../services";
import { GenericWidgetComponent } from "../abstract-components";
import { WidgetTypeComponent } from "../../interfaces";

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
    override widgetManager: WidgetManagerService,
    override widgetConnector: WidgetConnectService
  ) {
    super(widgetManager, widgetConnector);
  }

  emphasizedChannel: string;
  deemphasizedChannel: string;

  options: EChartsOption = {};
  updateOptions: EChartsOption = {};
  initOptions: {
    devicePixelRatio?: number;
    width?: number | string;
    height?: number | string;
  } = {}; //It may contain devicePixelRatio, renderer, width or height properties.
  echartsInstance: EChartsType;
  metricSeries: any = {};

  override ngOnDestroy(): void {
    this.echartsInstance = null;
    super.ngOnDestroy();
  }

  onChartEvent(event, type): void {
    console.log(event, type);
  }

  toggleKey(): void {
    if (this.echartsInstance && this.options.visualMap) {
      this.echartsInstance.setOption({
        visualMap: { show: this.showKey },
      });
    }
  }

  onChartInit(event): void {
    this.echartsInstance = event;
  }

  emphasizeChannel(channel): void {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "highlight",
        seriesName: channel,
      });
    }
  }

  deemphasizeChannel(channel): void {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "downplay",
        seriesName: channel,
      });
    }
  }

  startZoom(): void {
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

  resetZoom(): void {
    this.echartsInstance.dispatchAction({
      type: "dataZoom",
      start: 0,
      end: 100,
    });
  }

  zoomStopped(event: { batch?: unknown[] }): void {
    console.log("event in echart", event);
    if ("batch" in event && event.batch?.length !== 1) {
      this.widgetManager.zoomStatus$.next("stop");
    }
  }

  resize(): void {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }
}
