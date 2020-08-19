import { NgModule } from '@angular/core';

import { DashboardsComponent } from './components/dashboards/dashboards.component';
import { DashboardDetailComponent } from './components/dashboard-detail/dashboard-detail.component';
import { DashboardEditComponent } from './components/dashboard-edit/dashboard-edit.component';
import { DashboardViewComponent } from './components/dashboard-view/dashboard-view.component';
import { DashboardsRoutingModule } from './dashboards-routing.module';

import { WidgetsModule } from '@features/widgets/widgets.module';
import { WidgetEditComponent } from '@features/widgets/components/widget-edit/widget-edit.component';
import { AbilityModule } from '@casl/angular';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [
    DashboardsComponent,
    DashboardDetailComponent,
    DashboardEditComponent,
    DashboardViewComponent
  ],
  imports: [
    DashboardsRoutingModule,
    WidgetsModule,
    AbilityModule,
    NgxDaterangepickerMd.forRoot()
  ],
  entryComponents: [
    WidgetEditComponent
  ]
})
export class DashboardsModule { }
