import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Injector,
  Input,
  Renderer2,
  SimpleChange,
  SimpleChanges,
  ViewContainerRef,
} from "@angular/core";
import { ViewService } from "@core/services/view.service";
import { WidgetType } from "@features/widget/models/widget-type";
import { WidgetDataService } from "@features/widget/services/widget-data.service";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";
import { WidgetTypeService } from "@features/widget/services/widget-type.service";
import { ErrorComponent } from "@shared/components/error/error.component";
import { Widget } from "@squacapi/models/widget";
import { filter, Subscription } from "rxjs";
import { CalendarComponent } from "./calendar/calendar.component";
import { MapComponent } from "./map/map.component";
import { ParallelPlotComponent } from "./parallel-plot/parallel-plot.component";
import { ScatterPlotComponent } from "./scatter-plot/scatter-plot.component";
import { TabularComponent } from "./tabular/tabular.component";
import { TimechartComponent } from "./timechart/timechart.component";
import { TimelineComponent } from "./timeline/timeline.component";
import { WidgetTypeComponent } from "./widget-type.component";

export const componentMap = {
  map: MapComponent,
  "calendar-plot": CalendarComponent,
  "parallel-plot": ParallelPlotComponent,
  "scatter-plot": ScatterPlotComponent,
  tabular: TabularComponent,
  timeline: TimelineComponent,
  timeseries: TimechartComponent,
};

enum WidgetErrors {
  DATA = "no data found.",
  METRICS = "no measurements returned for one or more required metrics.",
  CHANNELS = "no channels selected.",
  MEASUREMENTS = "no measurements returned",
  API = "failed to get data from squac",
}
/**
 * solely responsible for showing either error component or the correct widget type
 */
@Directive({
  selector: "[widgetContainer]",
  providers: [WidgetTypeService],
})
export class WidgetTypeDirective {
  widgetType;
  widget: Widget;
  widgetId;

  errors;
  // errors = new Set<WidgetErrors>();
  showKey;
  zooming;
  subscription = new Subscription();
  dataSub;

  childComponentRef: ComponentRef<WidgetTypeComponent>;
  childComponent: WidgetTypeComponent;
  errorComponentRef: ComponentRef<ErrorComponent>;
  protected hostElement!: HTMLDivElement;

  constructor(
    protected readonly elementRef: ElementRef,
    protected readonly renderer: Renderer2,
    protected readonly changeDetectorRef: ChangeDetectorRef,
    protected readonly viewContainerRef: ViewContainerRef,
    private widgetDataService: WidgetDataService,
    private viewService: ViewService,
    private widgetTypeService: WidgetTypeService,
    private widgetManager: WidgetManagerService
  ) {
    this.hostElement = this.elementRef.nativeElement;
  }

  ngOnInit() {
    const errorsSub = this.widgetManager.errors.subscribe((errors) => {
      this.errors = errors;
      this.addError();
    });

    this.dataSub = this.widgetDataService.data.subscribe((data: any) => {
      if (this.errors) {
        //do error handling
        this.addError();
      } else if (data) {
        this.addWidget(this.widgetManager.widgetType.type);
        this.widgetTypeService.thresholds = this.widgetManager.thresholds;
        this.widgetTypeService.dataRange = this.widgetDataService.dataRange;
        this.childComponent.updateData(data);
      }
    });

    const resizeSub = this.viewService.resize
      .pipe(filter((id) => this.widgetId === id))
      .subscribe({
        next: () => {
          if (
            this.childComponent &&
            typeof this.childComponent.resize === "function"
          ) {
            //check if widget has resize function then call it
            this.childComponent.resize();
          }
        },
      });

    this.subscription.add(resizeSub);
    this.subscription.add(this.dataSub);
  }

  private clearChildComponents() {
    this.viewContainerRef.clear();
  }

  addWidget(widgetType: string) {
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
    this.clearChildComponents();
    const componentType = componentMap[widgetType];
    this.childComponentRef =
      this.viewContainerRef.createComponent<WidgetTypeComponent>(
        componentType,
        {
          injector,
        }
      );

    this.childComponent = this.childComponentRef.instance;
  }

  addError() {
    this.clearChildComponents();

    const errorComp =
      this.viewContainerRef.createComponent<ErrorComponent>(ErrorComponent);
    errorComp.instance.errorMsg = this.errors;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.clearChildComponents();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
