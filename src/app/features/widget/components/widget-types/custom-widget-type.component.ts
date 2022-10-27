import { Component } from "@angular/core";
import { WidgetConnectService } from "@features/widget/services/widget-connect.service";
import { WidgetManagerService } from "@features/widget/services/widget-manager.service";
import {
  GenericWidgetComponent,
  WidgetTypeComponent,
} from "./widget-type.component";

@Component({ template: "" })
// extends GenericWidgetComponent
export abstract class CustomWidgetTypeComponent
  extends GenericWidgetComponent
  implements WidgetTypeComponent
{
  constructor(
    protected widgetManager: WidgetManagerService,
    protected widgetConnector: WidgetConnectService
  ) {
    super(widgetManager, widgetConnector);
  }
}
