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
import { WidgetTypeComponent } from "@features/widget/components/widget-types/interfaces/widget-type.interface";
import { widgetTypeComponents } from "@features/widget/components/widget-types/interfaces/widget-types";
import {
  WidgetDisplayOption,
  WidgetType,
} from "@features/widget/interfaces/widget-type";
import {
  WidgetTypeInfo,
  WidgetTypes,
} from "@features/widget/interfaces/widget-types";
import { WidgetDataService } from "@features/widget/services/widget-data.service";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { Measurement } from "@squacapi/models/measurement";
import { Metric } from "@squacapi/models/metric";
import { Threshold } from "@squacapi/models/threshold";
import { WidgetProperties } from "@squacapi/models/widget";
import { of } from "rxjs";
import {
  channels,
  endtime,
  selectedMetrics,
  starttime,
} from "./widget-example-config";

@Directive({
  selector: "[widgetTypeExample]",
  providers: [WidgetTypeService, WidgetDataService],
})
export class WidgetTypeExampleDirective implements OnChanges, OnInit {
  @Input() type: WidgetTypes;
  @Input() stat: string;
  @Input() displayType: string;
  @Input() properties: WidgetProperties;
  @Input() selectedMetrics: Metric[];
  @Input() thresholds: Threshold[];

  channels = channels;
  _metrics;
  _thresholds;
  widgetType: WidgetType;
  widgetManager;
  dataRange;
  childComponentRef: ComponentRef<WidgetTypeComponent>;
  childComponent: WidgetTypeComponent;
  data;

  constructor(
    protected readonly elementRef: ElementRef,
    protected readonly viewContainerRef: ViewContainerRef,
    protected widgetTypeService: WidgetTypeService,
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

    this.widgetTypeService.chartDefaults.dataZoom = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.widgetManager) {
      if (changes.type || changes.displayType || changes.properties) {
        this.updateWidgetType();
      }

      if (changes.selectedMetrics && this.widgetType) {
        this.updateMetrics();
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
    const time = 30;
    const timeInterval = "minutes";
    const start = this.dateService.parseUtc(starttime);
    const end = this.dateService.parseUtc(endtime);

    this._metrics.forEach((m) => {
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
          let newEnd;
          if (!this.widgetType.useAggregate) {
            newEnd = currentTime.add(time, timeInterval);
            if (newEnd > end) {
              return;
            }
          } else {
            newEnd = end;
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

    if (this.type) {
      this.widgetType = WidgetTypeInfo[this.type].config;

      this.widgetManager.widgetType = this.widgetType;
      this.widgetDataService.stat = this.stat;
      this.widgetManager.properties = this.properties;
      this.widgetManager.widgetDisplayOption = this.properties.displayType;
      const injector = Injector.create({
        providers: [
          {
            provide: WidgetTypeService,
            useValue: this.widgetTypeService,
          },
          {
            provide: WidgetManagerService,
            useValue: this.widgetManager,
          },
        ],
      });
      const componentType = widgetTypeComponents[this.type];
      this.childComponentRef =
        this.viewContainerRef.createComponent<WidgetTypeComponent>(
          componentType,
          {
            injector,
          }
        );
      this.childComponent = this.childComponentRef.instance;

      this.updateMetrics();
    }
  }

  updateData() {
    if (this.childComponent) {
      this.childComponent.updateData(this.data);
    }
  }

  updateThresholds() {
    this._thresholds = this.getThresholds(this._metrics);
    this.widgetTypeService.thresholds = this._thresholds;
    this.updateData();
  }

  updateMetrics() {
    this._metrics =
      this.selectedMetrics && this.selectedMetrics.length > 0
        ? this.selectedMetrics
        : selectedMetrics;
    this.data = this.getData();
    this.widgetManager.selectedMetrics = this._metrics;
    this.widgetTypeService.dataRange = this.dataRange;
    this.updateThresholds();
  }
}
