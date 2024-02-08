import {
  ComponentRef,
  Directive,
  ElementRef,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewContainerRef,
} from "@angular/core";
import { DateService } from "@core/services/date.service";
import {
  DataRange,
  WidgetConfig,
  WidgetTypeComponent,
  WidgetTypes,
  WIDGET_TYPES,
} from "widgets";
import {
  WidgetConfigService,
  WidgetDataService,
  WidgetManagerService,
} from "widgets";
import { Measurement, MeasurementTypes, Metric } from "squacapi";
import { Threshold, WidgetProperties } from "squacapi";
import { of } from "rxjs";
import {
  channels,
  endtime,
  selectedMetrics,
  starttime,
} from "./widget-example-config";
import { WidgetType } from "widgets";

/**
 * Directive for adding a widget with fake data
 */
@Directive({
  selector: "[appWidgetTypeExample]",
  providers: [WidgetConfigService, WidgetDataService],
  standalone: true,
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
  dataRange: DataRange;
  childComponentRef: ComponentRef<WidgetTypeComponent>;
  childComponent: WidgetTypeComponent;
  data: MeasurementTypes[];

  constructor(
    protected readonly elementRef: ElementRef,
    protected readonly viewContainerRef: ViewContainerRef,
    protected widgetConfigService: WidgetConfigService,
    protected widgetDataService: WidgetDataService,
    private dateService: DateService,
    @Inject(WIDGET_TYPES) private widgetTypes: WidgetTypes
  ) {}

  /** set up widget manager and metrics */
  ngOnInit(): void {
    this.widgetManager = {
      toggleKey$: of(),
      zoomStatus$: of(),
      resize$: of(),
      starttime: starttime,
      endtime: endtime,
      channels: this.channels,
      stat: undefined,
      dataStat: "average",
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

  /**
   * listen to type changes and update
   *
   * @param changes type changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.widgetManager) {
      if (changes["displayType"] || changes["type"]) {
        this.updateWidgetType();
      }
    }
  }

  /**
   * Generate thresholds from metrics
   *
   * @param metrics selected metrics
   * @returns array of thresholds
   */
  getThresholds(metrics: Metric[]): Threshold[] {
    return metrics.map((m) => {
      return { min: m.minVal, max: m.maxVal, metricId: m.id };
    });
  }

  /**
   * Creates fake data for the widget
   *
   * @returns generated data
   */
  getData(): MeasurementTypes[] {
    this.dataRange = {};
    const data: MeasurementTypes[] = [];
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
        let currentTime = start;
        while (currentTime < end) {
          const newEnd = currentTime.add(time, timeInterval);
          if (newEnd > end) {
            return;
          }

          const starttime = this.dateService.format(currentTime);
          const endtime = this.dateService.format(newEnd);

          const value = Math.random() * m.maxVal + m.minVal;
          const measurement = new Measurement({
            id: 1,
            user: 1,
            metric: m.id,
            channel: c.id,
            value,
            starttime,
            endtime,
          });

          this.dataRange[m.id].count++;
          data.push(measurement);
          currentTime = newEnd;
        }
      });
    });
    return data;
  }

  /**
   * Set up new widget
   */
  updateWidgetType(): void {
    const widgetType = this.type;
    if (widgetType) {
      this.widgetManager.widgetType = widgetType;
      const widgetConfig = this.widgetTypes[widgetType].config;

      const displayOptions = widgetConfig.displayOptions;

      this.widgetManager.widgetConfig = widgetConfig;
      this.widgetManager.stat = this.stat;
      this.widgetDataService.stat = this.stat;
      if (
        !this.properties.displayType ||
        (displayOptions && !displayOptions[this.properties.displayType])
      ) {
        this.properties.displayType =
          this.widgetManager.widgetConfig.defaultDisplay;
      }

      this.widgetManager.properties = this.properties;
      const configService = this.createConfigService();
      const injector = Injector.create({
        providers: [
          {
            provide: WidgetConfigService,
            useValue: configService,
          },
          {
            provide: WidgetManagerService,
            useValue: this.widgetManager,
          },
        ],
      });
      const componentType = this.widgetTypes[widgetType].component;
      this.addWidgetComponent(componentType, injector);
    }
  }

  /**
   * Creates a fake config service
   *
   * @returns mocked config service
   */
  createConfigService(): WidgetConfigService {
    const configService = new WidgetConfigService();

    configService.thresholds = this._thresholds;
    configService.dataRange = this.dataRange;
    configService.chartDefaults.dataZoom = [];
    configService.chartDefaults.grid = {
      ...configService.chartDefaults.grid,
      left: 10,
      bottom: 15,
    };

    return configService;
  }

  /**
   * Add new widget component
   *
   * @param componentType type of widget to create
   * @param injector service injector
   */
  addWidgetComponent(componentType: any, injector: Injector): void {
    this.viewContainerRef.clear();
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

  /** update widget data */
  updateData(): void {
    if (this.childComponent) {
      this.childComponent.updateData(this.data);
    }
  }
}
