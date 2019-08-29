import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { DashboardsComponent } from './dashboards.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { DashboardEditComponent } from './dashboard-edit/dashboard-edit.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { WidgetComponent } from './dashboard-detail/widget/widget.component';
import { WidgetEditComponent } from './dashboard-detail/widget/widget-edit/widget-edit.component';
import { DashboardsRoutingModule } from './dashboards-routing.module';


@NgModule({
  declarations: [
    DashboardsComponent,
    DashboardDetailComponent,
    DashboardEditComponent,
    DashboardViewComponent,
    WidgetComponent,
    WidgetEditComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardsRoutingModule
  ],
  exports: [
    DashboardsComponent,
    DashboardDetailComponent,
    DashboardEditComponent,
    DashboardViewComponent,
    WidgetComponent,
    WidgetEditComponent
  ]
})
export class DashboardsModule { }
