import { NgModule } from '@angular/core';

import { DashboardsComponent } from './dashboards.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { DashboardsRoutingModule } from './dashboards-routing.module';

import { WidgetsModule } from '../widgets/widgets.module';
@NgModule({
  declarations: [
    DashboardsComponent,
    DashboardDetailComponent,
    DashboardEditComponent,
    DashboardViewComponent
  ],
  imports: [
    ResizableModule,
    DashboardsRoutingModule,
    NgxChartsModule,
    WidgetsModule
  ]
})
export class DashboardsModule { }
