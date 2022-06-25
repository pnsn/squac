import { Injectable } from "@angular/core";
import { ConfigurationService } from "@core/services/configuration.service";

@Injectable({
  providedIn: "root",
})
export class WidgetConfigService {
  private _widgetTypes;
  private _statTypes;
  private _solidOptions;
  private _gradientOptions;

  constructor(configService: ConfigurationService) {
    this._widgetTypes = configService.getValue("widgetTypes");
    this._statTypes = configService.getValue("statTypes");
    this._solidOptions = configService.getValue("solidOptions");
    this._gradientOptions = configService.getValue("gradientOptions");
  }

  get widgetTypes(): any[] {
    return this._widgetTypes;
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
