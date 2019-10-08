import { NgModule } from '@angular/core';

import { DashboardsComponent } from './dashboards.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { WidgetComponent } from './dashboard-detail/widget/widget.component';
import { WidgetEditComponent } from './dashboard-detail/widget/widget-edit/widget-edit.component';
import { DashboardsRoutingModule } from './dashboards-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MeasurementPipe } from './measurement.pipe';


@NgModule({
  declarations: [
    DashboardsComponent,
    DashboardDetailComponent,
    DashboardEditComponent,
    DashboardViewComponent,
    WidgetComponent,
    WidgetEditComponent,
    MeasurementPipe
  ],
  imports: [

    DashboardsRoutingModule,
    SharedModule
  ],
  exports: [
    // DashboardsComponent,
    // DashboardDetailComponent,
    // DashboardEditComponent,
    // DashboardViewComponent,
    // WidgetComponent,
    // WidgetEditComponent
  ]
})
export class DashboardsModule { }
