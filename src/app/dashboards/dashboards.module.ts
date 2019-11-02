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
import { TabularComponent } from './dashboard-detail/widget/widget-types/tabular/tabular.component';
import { TimelineComponent } from './dashboard-detail/widget/widget-types/timeline/timeline.component';
import { ResizableModule } from 'angular-resizable-element';
import { TimeseriesComponent } from './dashboard-detail/widget/widget-types/timeseries/timeseries.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    DashboardsComponent,
    DashboardDetailComponent,
    DashboardEditComponent,
    DashboardViewComponent,
    WidgetComponent,
    WidgetEditComponent,
    MeasurementPipe,
    TabularComponent,
    TimelineComponent,
    TimeseriesComponent,
  ],
  imports: [
    ResizableModule,
    DashboardsRoutingModule,
    SharedModule,
    NgxChartsModule
  ]
})
export class DashboardsModule { }
