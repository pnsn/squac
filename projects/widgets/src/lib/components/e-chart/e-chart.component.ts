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

  /**
   * @override
   */
  override ngOnDestroy(): void {
    this.echartsInstance = null;
    super.ngOnDestroy();
  }

  /**
   * Listener for e-chart events, see echart docs
   *
   * @param _event - event
   * @param _type - type
   */
  onChartEvent(_event: unknown, _type: unknown): void {
    return;
  }

  /**
   * Toggle visual map component
   */
  toggleKey(): void {
    if (this.echartsInstance && this.options.visualMap) {
      this.echartsInstance.setOption({
        visualMap: { show: this.showKey },
      });
    }
  }

  /**
   * Store echart reference on chart init
   *
   * @param event - echart reference
   */
  onChartInit(event): void {
    this.echartsInstance = event;
  }

  /**
   * @override
   */
  emphasizeChannel(channel): void {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "highlight",
        seriesName: channel,
      });
    }
  }

  /**
   * @override
   */
  deemphasizeChannel(channel): void {
    if (this.echartsInstance) {
      this.echartsInstance.dispatchAction({
        type: "downplay",
        seriesName: channel,
      });
    }
  }

  /**
   * Start chart zooming
   */
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

  /**
   * Reset chart zoom to start
   */
  resetZoom(): void {
    this.echartsInstance.dispatchAction({
      type: "dataZoom",
      start: 0,
      end: 100,
    });
  }

  /**
   * Respond to zoom stop event
   *
   * @param event - echart event
   * @param event.batch - event batch
   */
  zoomStopped(event: { batch?: unknown[] }): void {
    if ("batch" in event && event.batch?.length !== 1) {
      this.widgetManager.zoomStatus$.next("stop");
    }
  }

  /**
   * Trigger resize of chart
   */
  resize(): void {
    if (this.echartsInstance) {
      this.echartsInstance.resize();
    }
  }
}
