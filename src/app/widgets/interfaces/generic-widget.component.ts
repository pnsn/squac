import { Component, OnDestroy, OnInit } from "@angular/core";
import { WidgetType } from "../interfaces/widget-type";
import { WidgetConnectService } from "../services/widget-connect.service";
import { WidgetManagerService } from "../services/widget-manager.service";
import { Channel } from "@squacapi/models/channel";
import { Metric } from "@squacapi/models/metric";
import { WidgetProperties } from "@squacapi/models/widget";
import { Subscription } from "rxjs";

@Component({ template: "" })
export abstract class GenericWidgetComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  zooming: string;
  showKey = true; //default to key on
  loading: string;
  widgetType: WidgetType;

  data: any;
  channels: Channel[];
  selectedMetrics: Metric[];
  properties: WidgetProperties;
  visualMaps: any = {};

  abstract emphasizeChannel(channel: string): void;
  abstract deemphasizeChannel(channel: string): void;
  abstract startZoom(): void;
  abstract toggleKey(): void;

  abstract changeMetrics(): void;
  abstract buildChartData(data): Promise<void>;
  abstract configureChart(): void;

  constructor(
    protected widgetManager: WidgetManagerService,
    protected widgetConnector: WidgetConnectService
  ) {
    this.widgetType = widgetManager.widgetType;
  }

  initToggleKey() {
    const toggleKeySub = this.widgetManager.toggleKey.subscribe((show) => {
      this.showKey = show;
      this.toggleKey();
    });
    this.subscription.add(toggleKeySub);
  }

  initZoom() {
    const zoomSub = this.widgetManager.zoomStatus.subscribe((zoom) => {
      if (zoom !== this.zooming) {
        this.zooming = zoom;
        this.startZoom();
      }
    });
    this.subscription.add(zoomSub);
  }

  updateData(data: any): void {
    this.data = data;
    this.channels = this.widgetManager.channels;
    this.selectedMetrics = this.widgetManager.selectedMetrics;
    this.properties = this.widgetManager.properties;
    this.buildChartData(data).then(() => {
      this.changeMetrics();
    });
  }

  ngOnInit(): void {
    this.configureChart();
    if (this.widgetType.toggleKey) {
      this.initToggleKey();
    }

    if (this.widgetType.zoomControls) {
      this.initZoom();
    }
    const deemphsSub = this.widgetConnector.deemphasizeChannel.subscribe(
      (channel) => {
        this.deemphasizeChannel(channel);
      }
    );
    const emphSub = this.widgetConnector.emphasizedChannel.subscribe(
      (channel) => {
        this.emphasizeChannel(channel);
      }
    );
    this.subscription.add(emphSub);
    this.subscription.add(deemphsSub);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
