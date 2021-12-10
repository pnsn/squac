import { NgModule } from '@angular/core';

import { DashboardsComponent } from './components/dashboards/dashboards.component';
import { DashboardDetailComponent } from './components/dashboard-detail/dashboard-detail.component';
import { DashboardEditComponent } from './components/dashboard-edit/dashboard-edit.component';
import { DashboardViewComponent } from './components/dashboard-view/dashboard-view.component';
import { DashboardsRoutingModule } from './dashboards-routing.module';
import { AbilityModule } from '@casl/angular';
import { SharedModule } from '@shared/shared.module';
import { WidgetsModule } from '@features/widgets/widgets.module';

@NgModule({
  declarations: [
    DashboardsComponent,
    DashboardDetailComponent,
    DashboardEditComponent,
    DashboardViewComponent
  ],
  imports: [
    WidgetsModule,
    DashboardsRoutingModule,
    SharedModule,
    AbilityModule,
  ]
})
export class DashboardsModule { }
