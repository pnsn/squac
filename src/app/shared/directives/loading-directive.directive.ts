import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from "@angular/core";
import { LoadingSpinnerComponent } from "../components/loading-spinner/loading-spinner.component";

const OVERLAY_CLASS = "loading-full-screen";

// This directive places an overlay with a loading spinner over its host element
// if isLoading equals to true and hides the overlay when isLoading becomes false.
@Directive({
  selector: "[appIsLoading]",
})
export class LoadingDirective implements OnChanges {
  @Input("appIsLoading")
  isLoading = false;

  @Input() fullScreen;

  protected spinnerElement!: HTMLDivElement;
  protected hostElement!: HTMLDivElement;

  constructor(
    protected readonly elementRef: ElementRef,
    protected readonly renderer: Renderer2,
    protected readonly changeDetectorRef: ChangeDetectorRef,
    protected readonly viewContainerRef: ViewContainerRef,
    protected readonly componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.hostElement = this.elementRef.nativeElement;
    this.hostElement.style.position = "relative";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.spinnerElement) {
      this.init();
    }

    if (changes.isLoading) {
      const isLoadingValue = changes.isLoading.currentValue;
      if (isLoadingValue) {
        this.addLoadingIndicator();
      } else {
        this.removeLoadingIndicator();
      }

      this.changeDetectorRef.markForCheck();
    }
  }

  protected addLoadingIndicator(): void {
    this.renderer.appendChild(this.hostElement, this.spinnerElement);
  }

  protected removeLoadingIndicator(): void {
    this.renderer.removeChild(this.hostElement, this.spinnerElement);
    this.viewContainerRef.clear();
  }

  protected init(): void {
    this.initSpinnerComponent();
  }

  protected initSpinnerComponent(): void {
    const spinnerComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        LoadingSpinnerComponent
      );
    const spinnerComponent = this.viewContainerRef.createComponent(
      spinnerComponentFactory
    );

    this.spinnerElement = spinnerComponent.location.nativeElement;
    if (this.fullScreen) {
      this.spinnerElement.classList.add(OVERLAY_CLASS);
    }
  }
}
