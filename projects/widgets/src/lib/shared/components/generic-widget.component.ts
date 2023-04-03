import { Component, OnDestroy, OnInit } from "@angular/core";
import { ProcessedData, VisualMap, WidgetConfig } from "../../interfaces";
import { WidgetConnectService, WidgetManagerService } from "../../services";
import { Channel, Metric } from "squacapi";
import { WidgetProperties } from "squacapi";
import { Subscription } from "rxjs";

/**
 * Abstract widget class for widget components
 */
@Component({ template: "" })
export abstract class GenericWidgetComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  zooming: string;
  showKey = true; //default to key on
  loading: string;
  widgetConfig: WidgetConfig;
  data: ProcessedData;
  channels: Channel[];
  selectedMetrics: Metric[];
  properties: WidgetProperties;
  visualMaps: VisualMap = {};
  denseView: boolean;

  /**
   * Trigger emphasis action for channel
   *
   * @param channel - channel nslc to emphasize
   */
  abstract emphasizeChannel(channel: string): void;

  /**
   * Trigger deemphasize action for channel
   *
   * @param channel - channel nslc to deemphasize
   */
  abstract deemphasizeChannel(channel: string): void;

  /** Trigger zoom event */
  abstract startZoom(): void;

  /** Trigger key or legend toggle */
  abstract toggleKey(): void;

  /**
   * Change metrics in the chart
   */
  abstract changeMetrics(): void;

  /**
   * Use dense widget view
   */
  abstract useDenseView(useDenseView: boolean): void;

  /**
   * Takes in processed data and convert to format for chart
   *
   * @param data - date to update chart with
   * @returns - promise
   */
  abstract buildChartData(data: ProcessedData): Promise<void>;

  /**
   * Set up chart
   */
  abstract configureChart(): void;

  constructor(
    protected widgetManager: WidgetManagerService,
    protected widgetConnector: WidgetConnectService
  ) {
    this.widgetConfig = widgetManager.widgetConfig;
  }

  /**
   * Initializes toggle key subscription and functionality
   */
  initToggleKey(): void {
    const toggleKeySub = this.widgetManager.toggleKey$.subscribe((show) => {
      this.showKey = show;
      this.toggleKey();
    });
    this.subscription.add(toggleKeySub);
  }

  /**
   * Intializes zoom subscription and functionality
   */
  initZoom(): void {
    const zoomSub = this.widgetManager.zoomStatus$.subscribe((zoom) => {
      if (zoom !== this.zooming) {
        this.zooming = zoom;
        this.startZoom();
      }
    });
    this.subscription.add(zoomSub);
  }

  /**
   * Update widget data
   *
   * @param data - data for widget to update
   */
  updateData(data: ProcessedData): void {
    this.data = data;
    this.channels = this.widgetManager.channels;
    this.selectedMetrics = this.widgetManager.selectedMetrics;
    this.properties = this.widgetManager.properties;
    this.buildChartData(data).then(() => {
      this.changeMetrics();
    });
  }

  /**
   * Set up initial subscriptions
   */
  ngOnInit(): void {
    const deemphsSub = this.widgetConnector?.deemphasizeChannel.subscribe(
      (channel) => {
        this.deemphasizeChannel(channel);
      }
    );
    const emphSub = this.widgetConnector?.emphasizedChannel$.subscribe(
      (channel) => {
        this.emphasizeChannel(channel);
      }
    );
    const denseViewSub = this.widgetConnector?.useDenseView.subscribe(
      (useDenseView) => {
        this.useDenseView(useDenseView);
      }
    );
    this.configureChart();
    if (this.widgetConfig?.toggleKey) {
      this.initToggleKey();
    }

    if (this.widgetConfig?.zoomControls) {
      this.initZoom();
    }
    this.subscription.add(emphSub);
    this.subscription.add(deemphsSub);
    this.subscription.add(denseViewSub);
  }

  /** Unsubscribe on destroy */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
