import { Injectable } from "@angular/core";
import { ConfigurationService } from "@core/services/configuration.service";
import { WidgetType } from "../interfaces/widget-type";

@Injectable({
  providedIn: "root",
})
export class WidgetConfigService {
  private _widgetTypes;
  private _statTypes;
  private _solidOptions;
  private _gradientOptions;

  constructor(configService: ConfigurationService) {
    this.widgetTypes = configService.getValue("widgetTypes");
    this._statTypes = configService.getValue("statTypes");
    this._solidOptions = configService.getValue("solidOptions");
    this._gradientOptions = configService.getValue("gradientOptions");
  }

  set widgetTypes(_widgetTypes: any) {
    // this._widgetTypes = _widgetTypes.map((type: WidgetType) => {
    //   return new WidgetType(
    //     type.id,
    //     type.name,
    //     type.type,
    //     type.description,
    //     type.displayInfo,
    //     type.zoomControls,
    //     type.useAggregate,
    //     type.toggleKey,
    //     type.minMetrics,
    //     type.displayOptions
    //   );
    // });
  }

  get widgetTypes(): WidgetType[] {
    return this._widgetTypes;
  }

  getWidgetType(type: string): WidgetType {
    return this._widgetTypes.find((widgetType) => {
      return widgetType.type === type;
    });
  }

  get statTypes(): any[] {
    return this._statTypes;
  }

  get solidOptions(): any[] {
    return this._solidOptions;
  }

  get gradientOptions(): any[] {
    return this._gradientOptions;
  }
}
