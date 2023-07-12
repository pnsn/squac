import { NgModule } from "@angular/core";

import { DashboardComponent } from "./pages/main/dashboard.component";
import { DashboardDetailComponent } from "./pages/detail/dashboard-detail.component";
import { DashboardEditComponent } from "./components/dashboard-edit/dashboard-edit.component";
import { DashboardViewComponent } from "./pages/list/dashboard-view.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { AbilityModule } from "@casl/angular";
import { SharedModule } from "@shared/shared.module";
import { DashboardEditEntryComponent } from "./pages/edit/dashboard-edit-entry.component";
import { DataTypeSelectorComponent } from "./components/data-type-selector/data-type-selector.component";
import { ChannelFilterComponent } from "./components/channel-filter/channel-filter.component";
import { WidgetMainComponent } from "./pages/widget-main/widget-main.component";
import { WidgetDetailComponent } from "./components/widget-detail/widget-detail.component";
import { WidgetEditComponent } from "./components/widget-edit/widget-edit.component";
import { WidgetEditOptionsComponent } from "./components/widget-edit-options/widget-edit-options.component";
import { WidgetEditEntryComponent } from "./pages/widget-edit/widget-edit-entry.component";
import { WidgetEditMetricsComponent } from "./components/widget-edit-metrics/widget-edit-metrics.component";
import { WidgetEditInfoComponent } from "./components/widget-edit-info/widget-edit-info.component";
import { MetricToggleComponent } from "./components/metric-toggle/metric-toggle.component";
import { GridsterModule } from "angular-gridster2";
import { WidgetsModule } from "widgets";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { LoadingDirective } from "@shared/directives/loading-directive.directive";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatOptionModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatInputModule } from "@angular/material/input";
import { TooltipDirective } from "@shared/directives/tooltip.directive";

/** Dashboard feature module */
@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDetailComponent,
    DashboardViewComponent,
    DashboardEditEntryComponent,
    WidgetMainComponent,
    WidgetDetailComponent,
    WidgetEditComponent,
    WidgetEditOptionsComponent,
    WidgetEditEntryComponent,
  ],
  imports: [
    DashboardEditComponent,
    WidgetEditMetricsComponent,
    WidgetEditInfoComponent,
    MetricToggleComponent,
    ChannelFilterComponent,
    DataTypeSelectorComponent,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatOptionModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatDialogModule,
    MatStepperModule,
    MatSidenavModule,
    GridsterModule,
    WidgetsModule,
    DashboardRoutingModule,
    SharedModule,
    AbilityModule,
    TooltipDirective,
    LoadingDirective,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class DashboardModule {}
