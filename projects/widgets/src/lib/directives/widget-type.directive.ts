import {
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  Inject,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from "@angular/core";
import { WidgetDataService } from "../services/widget-data.service";
import { WidgetErrors } from "../enums";
import { WidgetManagerService } from "../services/widget-manager.service";
import { WidgetConfigService } from "../services/widget-config.service";
import { Widget } from "../models";
import { Subscription, tap } from "rxjs";
import { WidgetTypeComponent } from "../interfaces";
import { WidgetTypes, WIDGET_TYPES, WidgetType } from "../constants";
import { ErrorComponent } from "../components/error/error.component";
import { MeasurementTypes } from "squacapi";

/**
 * Directive for inserting error component or correct widget type
 */
@Directive({
  selector: "[widgetContainer]",
  providers: [WidgetConfigService],
  standalone: true,
})
export class WidgetTypeDirective implements OnInit, OnDestroy {
  currentWidgetType;
  widget: Widget;
  error;
  showKey;
  zooming;
  subscription = new Subscription();
  dataSub;

  childComponentRef: ComponentRef<WidgetTypeComponent>;
  childComponent: WidgetTypeComponent;
  // errorComponentRef: ComponentRef<ErrorComponent>;
  protected hostElement!: HTMLDivElement;

  constructor(
    protected readonly elementRef: ElementRef,
    protected readonly renderer: Renderer2,
    protected readonly changeDetectorRef: ChangeDetectorRef,
    protected readonly viewContainerRef: ViewContainerRef,
    private widgetDataService: WidgetDataService,
    private widgetConfigService: WidgetConfigService,
    private widgetManager: WidgetManagerService,
    @Inject(WIDGET_TYPES) private widgetTypes: WidgetTypes
  ) {
    this.hostElement = this.elementRef.nativeElement;
  }

  /**
   * Set up subscriptions
   */
  ngOnInit(): void {
    const managerErrors = this.widgetManager.errors$.subscribe(
      (error: WidgetErrors) => {
        this.addError(error);
      }
    );

    // listen to data changes
    this.dataSub = this.widgetDataService.data$
      .pipe(
        tap({
          next: (data: MeasurementTypes[] | WidgetErrors) => {
            //check if data is a map and has data
            if (typeof data !== "string") {
              if (
                this.widgetManager.widgetType !== this.currentWidgetType ||
                !this.childComponent
              ) {
                this.addWidget(this.widgetManager.widgetType);
              }

              this.widgetConfigService.thresholds =
                this.widgetManager.thresholds;
              this.childComponent.updateData(data);
              // }
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

  /**
   * clear existing components
   */
  private clearChildComponents(): void {
    this.viewContainerRef.clear();
  }

  /**
   * Add widget of given type
   *
   * @param widgetType - type of widget
   */
  addWidget(widgetType: WidgetType): void {
    this.error = "";
    const injector = Injector.create({
      providers: [
        {
          provide: WidgetConfigService,
          useValue: this.widgetConfigService,
        },
        {
          provide: WidgetManagerService,
          useValue: this.widgetManager,
        },
      ],
    });
    this.clearChildComponents();
    const componentType = this.widgetTypes[widgetType].component;
    this.childComponentRef =
      this.viewContainerRef.createComponent<WidgetTypeComponent>(
        componentType,
        {
          injector,
        }
      );
    this.currentWidgetType = widgetType;
    this.childComponent = this.childComponentRef.instance;
  }

  /**
   * Add error component
   *
   * @param error - error message
   */
  addError(error: WidgetErrors | string): void {
    this.clearChildComponents();
    if (this.childComponentRef) {
      this.childComponentRef.destroy();
      this.childComponent = null;
    }
    const errorComp =
      this.viewContainerRef.createComponent<ErrorComponent>(ErrorComponent);
    errorComp.instance.errorMsg = error;
    this.error = error;
  }

  /**
   * Destroy components and unsubscribe
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.clearChildComponents();
  }
}
