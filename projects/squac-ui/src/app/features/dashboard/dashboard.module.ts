import { NgModule } from "@angular/core";

import { DashboardComponent } from "./components/dashboard-main/dashboard.component";
import { DashboardDetailComponent } from "./components/dashboard-detail/dashboard-detail.component";
import { DashboardEditComponent } from "./components/dashboard-edit/dashboard-edit.component";
import { DashboardViewComponent } from "./components/dashboard-view/dashboard-view.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { AbilityModule } from "@casl/angular";
import { SharedModule } from "@shared/shared.module";
import { DashboardEditEntryComponent } from "./components/dashboard-edit/dashboard-edit-entry/dashboard-edit-entry.component";
import { DataTypeSelectorComponent } from "./components/dashboard-detail/data-type-selector/data-type-selector.component";
import { ChannelFilterComponent } from "./components/dashboard-detail/channel-filter/channel-filter.component";
import { WidgetMainComponent } from "./components/widget-main/widget-main.component";
import { WidgetDetailComponent } from "./components/widget-detail/widget-detail.component";
import { WidgetEditComponent } from "./components/widget-edit/widget-edit.component";
import { WidgetEditOptionsComponent } from "./components/widget-edit/widget-edit-options/widget-edit-options.component";
import { WidgetEditEntryComponent } from "./components/widget-edit/widget-edit-entry/widget-edit-entry.component";
import { WidgetEditMetricsComponent } from "./components/widget-edit/widget-edit-metrics/widget-edit-metrics.component";
import { WidgetEditInfoComponent } from "./components/widget-edit/widget-edit-info/widget-edit-info.component";
import { MetricToggleComponent } from "./components/widget-detail/metric-toggle/metric-toggle.component";
import { WidgetTypeExampleDirective } from "./components/widget-edit/widget-edit-info/widget-type-example/widget-type-example.directive";
import { GridsterModule } from "angular-gridster2";
import { WidgetsModule } from "widgets";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";

/** Dashboard feature module */
@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDetailComponent,
    DashboardEditComponent,
    DashboardViewComponent,
    DashboardEditEntryComponent,
    WidgetMainComponent,
    DataTypeSelectorComponent,
    ChannelFilterComponent,
    WidgetDetailComponent,
    WidgetEditComponent,
    WidgetEditOptionsComponent,
    WidgetEditMetricsComponent,
    WidgetEditEntryComponent,
    WidgetEditInfoComponent,
    MetricToggleComponent,
    WidgetTypeExampleDirective,
  ],
  imports: [
    GridsterModule,
    WidgetsModule,
    DashboardRoutingModule,
    SharedModule,
    AbilityModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class DashboardModule {}
