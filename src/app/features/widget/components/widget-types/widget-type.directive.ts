import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[widgetType]",
})
export class WidgetTypeDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
    console.log(viewContainerRef);
  }
}
