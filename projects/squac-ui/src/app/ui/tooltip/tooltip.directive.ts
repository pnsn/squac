import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  Injector,
  Input,
  OnDestroy,
} from "@angular/core";
import { TooltipComponent } from "./tooltip.component";
import { TooltipPosition, TooltipTheme } from "./tooltip.enums";

/**
 * Directive for adding a tooltip to an html element that will open
 * on mouseenter and close on mouseleave
 *
 * @example
 * <div
 *  [uiTooltip]='Tooltip message'
 *  position='dynamic'
 *  theme='dark'
 *  [showDelay]='0'
 *  [hideDelay]='0'
 *  >
 *  </div
 */
@Directive({
  selector: "[uiTooltip]",
})
export class TooltipDirective implements OnDestroy {
  /** Tooltip text */
  @Input() uiTooltip = "";
  /** Tooltip positioning relative to element*/
  @Input() position: TooltipPosition = TooltipPosition.DEFAULT;
  /** Tooltip coloring, light or dark */
  @Input() theme: TooltipTheme = TooltipTheme.DEFAULT;
  /** Delay in ms for showing tooltip */
  @Input() showDelay = 0;
  /** Deplay in ms for hiding tooltip */
  @Input() hideDelay = 0;

  /** Ref to element tooltip is attached to */
  private componentRef: ComponentRef<any> | null = null;
  /** Timeout for showing tooltip */
  private showTimeout?: number;
  /** Timeout for hiding tooltip */
  private hideTimeout?: number;
  /** Timeout for opening after touch event */
  private touchTimeout?: number;

  constructor(
    private elementRef: ElementRef,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  /** Listen to mouseenter events to open tooltip */
  @HostListener("mouseenter")
  onMouseEnter(): void {
    this.initializeTooltip();
  }

  /** Listen to mouseleave events to close tooltip */
  @HostListener("mouseleave")
  onMouseLeave(): void {
    this.setHideTooltipTimeout();
  }

  /**
   * List to mousemove events for tooltip positioning
   *
   * @param $event mouse move event
   */
  @HostListener("mousemove", ["$event"])
  onMouseMove($event: MouseEvent): void {
    if (
      this.componentRef !== null &&
      this.position === TooltipPosition.DYNAMIC
    ) {
      this.componentRef.instance.left = $event.clientX;
      this.componentRef.instance.top = $event.clientY;
      this.componentRef.instance.tooltip = this.uiTooltip;
    }
  }

  /**
   * Listen to touch events for mobile users
   *
   * @param $event touch event
   */
  @HostListener("touchstart", ["$event"])
  onTouchStart($event: TouchEvent): void {
    $event.preventDefault();
    window.clearTimeout(this.touchTimeout);
    this.touchTimeout = window.setTimeout(
      this.initializeTooltip.bind(this),
      500
    );
  }

  /** Listen to end of touch event to close tooltip */
  @HostListener("touchend")
  onTouchEnd(): void {
    window.clearTimeout(this.touchTimeout);
    this.setHideTooltipTimeout();
  }

  /**
   * Creates tooltip and attaches to host element if it does not exist
   */
  private initializeTooltip() {
    if (this.componentRef === null) {
      window.clearInterval(this.hideDelay);
      const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(TooltipComponent);
      this.componentRef = componentFactory.create(this.injector);

      this.appRef.attachView(this.componentRef.hostView);
      const [tooltipDOMElement] = (
        this.componentRef.hostView as EmbeddedViewRef<any>
      ).rootNodes;

      this.setTooltipComponentProperties();

      document.body.appendChild(tooltipDOMElement);
      this.showTimeout = window.setTimeout(
        this.showTooltip.bind(this),
        this.showDelay
      );
    }
  }

  /**
   * Calculates tooltip properties for positioning
   */
  private setTooltipComponentProperties(): void {
    if (this.componentRef !== null) {
      this.componentRef.instance.tooltip = this.uiTooltip;
      this.componentRef.instance.position = this.position;
      this.componentRef.instance.theme = this.theme;

      const { left, right, top, bottom } =
        this.elementRef.nativeElement.getBoundingClientRect();

      switch (this.position) {
        case TooltipPosition.BELOW: {
          this.componentRef.instance.left = Math.round(
            (right - left) / 2 + left
          );
          this.componentRef.instance.top = Math.round(bottom);
          break;
        }
        case TooltipPosition.ABOVE: {
          this.componentRef.instance.left = Math.round(
            (right - left) / 2 + left
          );
          this.componentRef.instance.top = Math.round(top);
          break;
        }
        case TooltipPosition.RIGHT: {
          this.componentRef.instance.left = Math.round(right);
          this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        case TooltipPosition.LEFT: {
          this.componentRef.instance.left = Math.round(left);
          this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  /**
   * Sets component visibility to true
   */
  private showTooltip(): void {
    if (this.componentRef !== null) {
      this.componentRef.instance.visible = true;
    }
  }

  /**
   * Add timeout for hiding tooltip
   */
  private setHideTooltipTimeout(): void {
    this.hideTimeout = window.setTimeout(
      this.destroy.bind(this),
      this.hideDelay
    );
  }

  /** Destroy element */
  ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * Clears intervals and detaches component from the host
   */
  destroy(): void {
    if (this.componentRef !== null) {
      window.clearInterval(this.showTimeout);
      window.clearInterval(this.hideDelay);
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
