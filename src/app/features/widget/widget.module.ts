import { NgModule } from "@angular/core";
import { WidgetDetailComponent } from "./components/widget-detail/widget-detail.component";
import { WidgetEditComponent } from "./components/widget-edit/widget-edit.component";
import { GridsterModule } from "angular-gridster2";
import { WidgetEditOptionsComponent } from "./components/widget-edit/widget-edit-options/widget-edit-options.component";
import { WidgetEditMetricsComponent } from "./components/widget-edit/widget-edit-metrics/widget-edit-metrics.component";
import { SharedModule } from "@shared/shared.module";
import { WidgetMainComponent } from "./components/widget-main/widget-main.component";
import { WidgetEditEntryComponent } from "./components/widget-edit/widget-edit-entry/widget-edit-entry.component";
import { WidgetEditInfoComponent } from "./components/widget-edit/widget-edit-info/widget-edit-info.component";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { MetricToggleComponent } from "./components/widget-detail/metric-toggle/metric-toggle.component";
import { WidgetTypeExampleDirective } from "./components/widget-edit/widget-edit-info/widget-type-example/widget-type-example.directive";
import { WidgetsModule } from "app/widgets/widgets.module";

@NgModule({
  declarations: [
    WidgetMainComponent,
    WidgetDetailComponent,
    WidgetEditComponent,
    WidgetEditOptionsComponent,
    WidgetEditMetricsComponent,
    WidgetEditEntryComponent,
    WidgetEditInfoComponent,
    MetricToggleComponent,
    WidgetTypeExampleDirective,
  ],
  imports: [SharedModule, GridsterModule, WidgetsModule],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class WidgetModule {}
