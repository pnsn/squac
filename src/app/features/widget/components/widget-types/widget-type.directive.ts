import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from "@angular/core";
import { WidgetDataService } from "@features/widget/services/widget-data.service";
import { WidgetErrors } from "@features/widget/services/widget-errors";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";
import { WidgetConfigService } from "@features/widget/services/widget-config.service";
import { ErrorComponent } from "@shared/components/error/error.component";
import { Widget } from "@squacapi/models/widget";
import { Subscription, tap } from "rxjs";
import { WidgetTypeComponent } from "./interfaces/widget-type.interface";
import { widgetTypeComponents } from "./interfaces/widget-types";

/**
 * solely responsible for showing either error component or the correct widget type
 */
@Directive({
  selector: "[widgetContainer]",
  providers: [WidgetConfigService],
})
export class WidgetTypeDirective implements OnInit, OnDestroy {
  widgetType;
  widget: Widget;
  error;
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
    private widgetTypeService: WidgetConfigService,
    private widgetManager: WidgetManagerService
  ) {
    this.hostElement = this.elementRef.nativeElement;
  }

  ngOnInit() {
    const managerErrors = this.widgetManager.errors.subscribe(
      (error: WidgetErrors) => {
        this.addError(error);
      }
    );

    this.dataSub = this.widgetDataService.data
      .pipe(
        tap({
          next: (data: Map<number, any> | WidgetErrors) => {
            if (data instanceof Map) {
              this.addWidget(this.widgetManager.widgetType.type);
              this.widgetTypeService.thresholds = this.widgetManager.thresholds;
              this.widgetTypeService.dataRange =
                this.widgetDataService.dataRange;
              this.childComponent.updateData(data);
            } else {
              this.addError(data);
            }
          },
        })
      )
      .subscribe();

    this.subscription.add(managerErrors);
    this.subscription.add(this.dataSub);
  }

  private clearChildComponents() {
    this.viewContainerRef.clear();
  }

  addWidget(widgetType: string) {
    this.error = "";
    const injector = Injector.create({
      providers: [
        {
          provide: WidgetConfigService,
          useValue: this.widgetTypeService,
        },
        {
          provide: WidgetManagerService,
          useValue: this.widgetManager,
        },
      ],
    });
    this.clearChildComponents();
    const componentType = widgetTypeComponents[widgetType];
    this.childComponentRef =
      this.viewContainerRef.createComponent<WidgetTypeComponent>(
        componentType,
        {
          injector,
        }
      );

    this.childComponent = this.childComponentRef.instance;
  }

  addError(error: WidgetErrors) {
    if (!this.error) {
      this.clearChildComponents();

      const errorComp =
        this.viewContainerRef.createComponent<ErrorComponent>(ErrorComponent);
      errorComp.instance.errorMsg = error;
      this.error = error;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.clearChildComponents();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
