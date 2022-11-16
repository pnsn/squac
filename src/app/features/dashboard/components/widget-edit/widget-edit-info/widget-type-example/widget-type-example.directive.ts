import {
  ComponentRef,
  Directive,
  ElementRef,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewContainerRef,
} from "@angular/core";
import { DateService } from "@core/services/date.service";
import { WidgetConfig, WidgetTypeComponent } from "app/widgets/interfaces";
import {
  WidgetConfigService,
  WidgetDataService,
  WidgetManagerService,
} from "app/widgets/services";
import { Measurement, Metric } from "@squacapi/models";
import { Threshold, WidgetProperties } from "@squacapi/interfaces";
import { of } from "rxjs";
import {
  channels,
  endtime,
  selectedMetrics,
  starttime,
} from "./widget-example-config";
import { WidgetType } from "app/widgets/enums";
import { WIDGET_TYPE_INFO } from "app/widgets/constants";

@Directive({
  selector: "[widgetTypeExample]",
  providers: [WidgetConfigService, WidgetDataService],
})
export class WidgetTypeExampleDirective implements OnChanges, OnInit {
  @Input() type: WidgetType;
  @Input() stat: string;
  @Input() displayType: string;
  @Input() properties: WidgetProperties;
  @Input() selectedMetrics: Metric[];
  @Input() thresholds: Threshold[];

  channels = channels;
  _metrics;
  _thresholds;
  widgetConfig: WidgetConfig;
  widgetManager;
  dataRange;
  childComponentRef: ComponentRef<WidgetTypeComponent>;
  childComponent: WidgetTypeComponent;
  data;

  constructor(
    protected readonly elementRef: ElementRef,
    protected readonly viewContainerRef: ViewContainerRef,
    protected widgetConfigService: WidgetConfigService,
    protected widgetDataService: WidgetDataService,
    private dateService: DateService
  ) {}

  ngOnInit() {
    this.widgetManager = {
      toggleKey: of(),
      zoomStatus: of(),
      resize: of(),
      starttime: starttime,
      endtime: endtime,
      channels: this.channels,
    };

    this._metrics =
      this.selectedMetrics && this.selectedMetrics.length > 0
        ? this.selectedMetrics
        : selectedMetrics;
    this.data = this.getData();
    this.widgetManager.selectedMetrics = this._metrics;

    this._thresholds = this.getThresholds(this._metrics);

    this.updateWidgetType();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.widgetManager) {
      if (changes.displayType || changes.properties) {
        this.updateWidgetType();
      }
    }
  }

  getThresholds(metrics) {
    return metrics.map((m) => {
      return { min: m.minVal, max: m.maxVal, metricId: m.id };
    });
  }

  getData() {
    this.dataRange = {};
    const data = new Map<number, any>();
    const timeInterval = "seconds";
    const start = this.dateService.parseUtc(starttime);
    const end = this.dateService.parseUtc(endtime);

    this._metrics.forEach((m: Metric) => {
      const time = m.sampleRate;
      this.dataRange[m.id] = {
        min: m.minVal,
        max: m.maxVal,
        count: 0,
      };

      this.channels.forEach((c) => {
        if (!data.has(c.id)) {
          const newMap = new Map<number, any>();
          data.set(c.id, newMap);
        }
        const measurements = [];

        let currentTime = start;
        while (currentTime < end) {
          const newEnd = currentTime.add(time, timeInterval);
          if (newEnd > end) {
            return;
          }

          const starttime = this.dateService.format(currentTime);
          const endtime = this.dateService.format(newEnd);

          const value = Math.random() * m.maxVal + m.minVal;
          const measurement = new Measurement(
            1,
            1,
            m.id,
            c.id,
            value,
            starttime,
            endtime
          );

          this.dataRange[m.id].count++;
          measurements.push(measurement);
          currentTime = newEnd;
        }

        data.get(c.id).set(m.id, measurements);
      });
    });
    return data;
  }

  updateWidgetType() {
    this.viewContainerRef.clear();

    const widgetType = this.type;
    if (widgetType) {
      this.widgetManager.widgetType = widgetType;
      const widgetConfig = WIDGET_TYPE_INFO[widgetType].config;

      const displayOptions = widgetConfig.displayOptions;

      this.widgetManager.widgetConfig = widgetConfig;
      this.widgetDataService.stat = this.stat;
      if (
        !this.properties.displayType ||
        (displayOptions && !displayOptions[this.properties.displayType])
      ) {
        this.properties.displayType =
          this.widgetManager.widgetConfig.defaultDisplay;
      }
      const widgetConfigService = new WidgetConfigService();

      widgetConfigService.thresholds = this._thresholds;
      widgetConfigService.dataRange = this.dataRange;
      widgetConfigService.chartDefaults.dataZoom = [];

      widgetConfigService.chartDefaults.grid = {
        ...widgetConfigService.chartDefaults.grid,
        left: 10,
        bottom: 15,
      };
      this.widgetManager.properties = this.properties;
      const injector = Injector.create({
        providers: [
          {
            provide: WidgetConfigService,
            useValue: widgetConfigService,
          },
          {
            provide: WidgetManagerService,
            useValue: this.widgetManager,
          },
        ],
      });
      const componentType = WIDGET_TYPE_INFO[widgetType].component;
      this.childComponentRef =
        this.viewContainerRef.createComponent<WidgetTypeComponent>(
          componentType,
          {
            injector,
          }
        );
      this.childComponent = this.childComponentRef.instance;
      this.childComponent.updateData(this.data);
    }
  }

  updateData() {
    if (this.childComponent) {
      this.childComponent.updateData(this.data);
    }
  }

  // updateThresholds() {
  //   this._thresholds = this.getThresholds(this._metrics);
  //   this.widgetConfigService.thresholds = this._thresholds;
  //   this.updateData();
  // }

  // updateMetrics() {
  //   this._metrics =
  //     this.selectedMetrics && this.selectedMetrics.length > 0
  //       ? this.selectedMetrics
  //       : selectedMetrics;
  //   this.data = this.getData();
  //   this.widgetManager.selectedMetrics = this._metrics;
  //   this.widgetConfigService.dataRange = this.dataRange;
  //   this.updateThresholds();
  // }
}
