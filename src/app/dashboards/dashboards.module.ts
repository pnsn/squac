import { NgModule } from '@angular/core';

import { DashboardsComponent } from './dashboards.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { DashboardsRoutingModule } from './dashboards-routing.module';

import { WidgetsModule } from '../widgets/widgets.module';
import { WidgetEditComponent } from '../widgets/widget-edit/widget-edit.component';
import { AbilityModule } from '@casl/angular';
import { SharedModule } from '../shared/shared.module';

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
    AbilityModule
  ],
  entryComponents: [
    WidgetEditComponent
  ]
})
export class DashboardsModule { }
